import React from 'react';
import { API_BASE_URL } from '../../config/app-config';

const PostContent = ({ post }) => {
  return (
    <div className="post-content">
      <p>{post.content}</p>
      
      {post.thumbnails && post.thumbnails.length > 0 && (
        <div className="post-images">
          {post.thumbnails.map((thumbnail, index) => (
            <img 
              key={index}
              className="post-image"
              src={`${API_BASE_URL}/images/${thumbnail}`}
              alt={`Thumbnail ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {post.tags && post.tags.length > 0 && (
        <div className="tag-container">
          {post.tags.map((tag, index) => (
            <span key={index} className="tag">#{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostContent;