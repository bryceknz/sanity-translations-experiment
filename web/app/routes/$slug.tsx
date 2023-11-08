import type { LoaderFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { defer } from '@remix-run/node'; // or cloudflare/deno
import { Await, Link, useLoaderData } from '@remix-run/react';
import {
  Container,
  Post as PostComponent,
  type Post,
  PostSkeleton,
} from 'components';
import { getLocale } from '../../util';
import { Suspense } from 'react';

export async function loader({ request }: LoaderFunctionArgs) {
  const locale = getLocale(request.headers.get('Accept-Language'));
  const slug = new URL(request.url).pathname.split('/').pop();
  const postPromise = fetch(`http://localhost:3000/posts/${slug}`, {
    method: 'GET',
    headers: {
      'Accept-Language': locale,
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
      return null;
    });

  return defer({
    post: postPromise,
  });
}

export default function Page() {
  const { post } = useLoaderData<typeof loader>();

  if (!post) {
    return (
      <Container>
        <Link to="/" className="block mb-4">
          🔙
        </Link>
        <h1 className="text-4xl font-bold mb-6">Post not found</h1>
      </Container>
    );
  }

  return (
    <Container>
      <Link to="/" className="block mb-4">
        🔙
      </Link>
      <Suspense fallback={<PostSkeleton />}>
        <Await resolve={post}>
          {(resolvedPost) => <PostComponent post={resolvedPost as Post} />}
        </Await>
      </Suspense>
    </Container>
  );
}