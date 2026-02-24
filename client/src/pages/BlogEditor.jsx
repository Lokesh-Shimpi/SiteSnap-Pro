import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
export default function BlogEditor() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    const { user } = useContext(AuthContext);
    useEffect(() => {
        if (isEdit) {
            const fetchBlog = async () => {
                try {
                    const res = await axios.get('http://localhost:3000/api/blogs'); // Not the best way since we fetch all, let's just fetch everything or build a GET /api/blogs/:id 
                    const blog = res.data.find(b => b._id === id);
                    if (blog) {
                        setTitle(blog.title);
                        setContent(blog.content);
                        const userId = user?.id || user?._id;
                        if (blog.author && blog.author._id !== userId) {
                            navigate('/blogs'); 
                        }
                    } else {
                        navigate('/blogs');
                    }
                } catch (error) {
                    console.error('Failed to fetch blog', error);
                }
            };
            fetchBlog();
        }
    }, [id, isEdit, navigate, user]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { title, content };
            if (isEdit) {
                await axios.put(`http://localhost:3000/api/blogs/${id}`, payload, config);
            } else {
                await axios.post('http://localhost:3000/api/blogs', payload, config);
            }
            navigate('/blogs');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save post.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] transition-colors duration-300 font-sans flex flex-col">
            <Navbar />
            <main className="flex-grow pt-20 pb-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate('/blogs')}
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Feed
                    </button>
                    <div className="bg-white dark:bg-[#0B1120]/60 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-10 shadow-sm">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                            {isEdit ? 'Edit Post' : 'Write a New Post'}
                        </h1>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-100">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Article Title..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="w-full bg-transparent border-none text-3xl font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 p-0"
                                />
                            </div>
                            <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />
                            <div>
                                <textarea
                                    placeholder="Write your thoughts here..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                    rows={15}
                                    className="w-full bg-transparent border-none text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:ring-0 p-0 resize-y font-sans leading-relaxed"
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Saving...' : isEdit ? 'Update Post' : 'Publish Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
