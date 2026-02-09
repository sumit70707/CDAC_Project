import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../../services/blogService';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="bg-white min-h-screen py-16 font-sans text-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif italic mb-4">The Journal</h1>
          <p className="text-gray-500 tracking-widest uppercase text-sm">Science. Stories. Skin.</p>
        </div>

        {loading ? (
          <div className="flex justify-center p-20"><span className="loading loading-dots loading-lg text-black"></span></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts.map(post => (
              <Link to={`/blog/${post.id}`} key={post.id} className="group cursor-pointer">
                <div className="overflow-hidden mb-6 aspect-[4/3]">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-gray-400 mb-3">
                  <span>{post.category}</span>
                  <span>&bull;</span>
                  <span>{post.date}</span>
                </div>
                <h2 className="text-2xl font-bold mb-3 group-hover:underline leading-tight">{post.title}</h2>
                <p className="text-gray-600 line-clamp-3 mb-4">{post.excerpt}</p>
                <span className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1">Read Article</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;