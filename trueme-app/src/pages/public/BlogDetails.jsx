import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostById } from '../../services/blogService';

const BlogDetails = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await getPostById(id);
                setPost(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-dots loading-lg"></span></div>;
    if (!post) return <div className="min-h-screen flex items-center justify-center">Article not found.</div>;

    return (
        <div className="bg-white min-h-screen py-20 font-sans text-black animate-fade-in">
            <article className="max-w-3xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center gap-4 text-xs uppercase tracking-widest text-gray-400 mb-6">
                        <span>{post.category}</span>
                        <span>&bull;</span>
                        <span>{post.date}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif italic mb-8 leading-tight">{post.title}</h1>
                    <div className="flex justify-center items-center gap-2">
                        <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-8">
                                <span>{post.author.charAt(0)}</span>
                            </div>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest">By {post.author}</span>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="mb-12 aspect-video overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                </div>

                {/* Content */}
                <div
                    className="prose prose-lg mx-auto prose-headings:font-serif prose-headings:italic prose-a:text-black prose-img:rounded-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                ></div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                    <Link to="/blog" className="btn btn-outline border-black text-black hover:bg-black hover:text-white rounded-none uppercase tracking-widest px-8">
                        Back to Journal
                    </Link>
                </div>
            </article>
        </div>
    );
};

export default BlogDetails;
