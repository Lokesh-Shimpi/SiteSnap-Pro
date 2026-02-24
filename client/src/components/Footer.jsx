import React from 'react';
import { Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function Footer() {
    return (
        <footer className="bg-slate-50 dark:bg-[#0B1120] border-t border-slate-200 dark:border-gray-800 pt-16 pb-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
                    { }
                    <div className="space-y-4 max-w-sm">
                        <div className="flex items-center gap-2">
                            <Activity className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">SiteSnap Pro</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            Enterprise-grade synthetic monitoring and visual regression testing for modern engineering teams.
                        </p>
                    </div>
                    { }
                    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                        <Link to="/features" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            Features
                        </Link>
                        <Link to="/about" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            About Us
                        </Link>
                        <Link to="/blogs" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            Community Blog
                        </Link>
                    </div>
                </div>
                <div className="border-t border-slate-200 dark:border-gray-800 pt-8 flex justify-center items-center">
                    <p className="text-slate-500 dark:text-slate-500 text-sm text-center">
                        © {new Date().getFullYear()} SiteSnap Pro Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
