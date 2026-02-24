import React, { useContext } from 'react';
import { Heart, Edit2, Trash2, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
export default function BlogCard({ blog, onLike, onDelete }) {
    const { user } = useContext(AuthContext);
    const userId = user?.id || user?._id;
    const isAuthor = user && blog.author && userId === blog.author._id;
    const hasLiked = user && blog.likes.includes(userId);
    const likeCount = blog.likes.length;
    const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    return (
        <div className="bg-white dark:bg-[#0B1120]/40 border border-gray-200 dark:border-gray-800 rounded-xl p-6 transition-all hover:shadow-md dark:hover:border-gray-700">
            <h3 className="text-2xl font-bold font-sans text-slate-900 dark:text-white mb-3 leading-tight">
                {blog.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 whitespace-pre-wrap font-sans">
                {blog.content}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                        <User className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="font-medium">{blog.author?.username || 'Unknown Author'}</span>
                    <span className="mx-1">•</span>
                    <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onLike(blog._id)}
                        className={`flex items-center gap-1.5 transition-colors ${hasLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
                        disabled={!user}
                        title={!user ? 'Log in to like' : 'Like post'}
                    >
                        <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
                        <span className="text-sm font-medium">{likeCount}</span>
                    </button>
                    {isAuthor && (
                        <div className="flex items-center gap-2">
                            <Link
                                to={`/blogs/edit/${blog._id}`}
                                className="p-1.5 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <Edit2 className="w-4 h-4" />
                            </Link>
                            <button
                                onClick={() => onDelete(blog._id)}
                                className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
