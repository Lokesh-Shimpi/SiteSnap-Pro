import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PlusCircle } from 'lucide-react';
import BlogCard from '../components/BlogCard';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
export default function BlogFeed() {
    const [blogs, setBlogs] = useState([]);
    const [sort, setSort] = useState('newest');
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:3000/api/blogs?sort=${sort}`);
            setBlogs(res.data);
        } catch (error) {
            console.error('Failed to fetch blogs:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchBlogs();
    }, [sort]);
    const handleLike = async (id) => {
        if (!user) return; 
        const userId = user?.id || user?._id;
        setBlogs(prevBlogs => prevBlogs.map(blog => {
            if (blog._id === id) {
                const hasLiked = blog.likes.includes(userId);
                let newLikes = [...blog.likes];
                if (hasLiked) {
                    newLikes = newLikes.filter(uid => uid !== userId);
                } else {
                    newLikes.push(userId);
                }
                return { ...blog, likes: newLikes };
            }
            return blog;
        }));
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`http://localhost:3000/api/blogs/${id}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBlogs(prevBlogs => prevBlogs.map(blog => blog._id === id ? res.data : blog));
        } catch (error) {
            console.error('Failed to like post:', error);
            fetchBlogs();
        }
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/api/blogs/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBlogs(blogs.filter(blog => blog._id !== id));
        } catch (error) {
            console.error('Failed to delete blog:', error);
            alert('Could not delete blog');
        }
    };
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] transition-colors duration-300 font-sans flex flex-col">
            <Navbar />
            <main className="flex-grow pt-20 pb-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Community Insights</h1>
                            <p className="mt-2 text-slate-600 dark:text-slate-400">Share tips, post-mortems, and web performance articles.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="bg-white dark:bg-[#0B1120]/50 border border-gray-300 dark:border-gray-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 transition-colors"
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="mostLiked">Most Liked</option>
                            </select>
                            {user && (
                                <Link
                                    to="/blogs/new"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-all active:scale-95"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    Write a Post
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="space-y-6">
                        {loading ? (
                            <div className="text-center py-10 text-slate-500">Loading posts...</div>
                        ) : blogs.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-[#0B1120]/40 border border-gray-200 dark:border-gray-800 rounded-xl">
                                <p className="text-slate-500 dark:text-slate-400 mb-4">No posts found.</p>
                                {user && (
                                    <Link to="/blogs/new" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                                        Be the first to share!
                                    </Link>
                                )}
                            </div>
                        ) : (
                            blogs.map(blog => (
                                <BlogCard
                                    key={blog._id}
                                    blog={blog}
                                    onLike={handleLike}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
