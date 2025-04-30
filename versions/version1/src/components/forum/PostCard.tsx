import React from 'react';

interface Post {
  id: string;
  content: string;
  // Otros campos que necesites
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="border p-4 rounded-lg shadow hover:shadow-md">
      <h2 className="text-xl font-bold mb-2">Post ID: {post.id}</h2>
      <p className="text-gray-600 mb-4">{post.content}</p>
      {/* Otros detalles del post */}
    </div>
  );
};

export default PostCard;
