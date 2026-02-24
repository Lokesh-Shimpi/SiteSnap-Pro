import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, LogOut, Sun, Moon } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    { }
                    <div className="flex items-center gap-10">
                        <Link to="/" className="flex-shrink-0 group">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors">
                                    <Activity className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">SiteSnap Pro</span>
                            </div>
                        </Link>
                    </div>
                    { }
                    <div className="flex items-center gap-4">
                        { }
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-yellow-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-500 hidden md:block"></div>
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/dashboard"
                                    className={`text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors">
                                    Log in
                                </Link>
                                <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm shadow-indigo-200 dark:shadow-none transition-all active:scale-95">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
