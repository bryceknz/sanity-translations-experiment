import { useLoaderData, Link } from 'react-router-dom';

import { BlogListItem, PortableText } from '../../components';

export default function PostPage() {
  const data = useLoaderData() as {
    post: BlogListItem;
  };
  const { post } = data;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link to="/" className="block mb-4">
        🔙
      </Link>
      <h1 className="text-4xl font-bold mb-6">{post?.title}</h1>
      <PortableText value={post?.body} />
    </div>
  );
}
