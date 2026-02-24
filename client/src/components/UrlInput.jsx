import React, { useState } from 'react';
import { Search, Monitor, Smartphone, Camera, Download, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
export default function UrlInput({ onCapture, isLoading }) {
    const [url, setUrl] = useState('');
    const [view, setView] = useState('desktop');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (url.trim()) {
            onCapture(url, view);
        }
    };
    return (
        <div className="w-full max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-4 bg-white dark:bg-[#000000] p-3 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 transition-all">
                {}
                <div className="relative flex-grow w-full md:w-auto">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-11 pr-4 py-3.5 bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-0 text-base transition-colors"
                        placeholder="Enter website URL (e.g., google.com)"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                    />
                </div>
                {}
                <div className="flex items-center gap-1 px-3 border-y border-transparent md:border-y-0 md:border-l border-gray-200 dark:border-gray-800 self-stretch my-2 md:my-0 shrink-0 py-2 md:py-0 justify-center">
                    <button
                        type="button"
                        onClick={() => setView('desktop')}
                        className={`p-2.5 rounded-xl transition-all ${view === 'desktop' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                        title="Desktop View"
                    >
                        <Monitor className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setView('mobile')}
                        className={`p-2.5 rounded-xl transition-all ${view === 'mobile' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                        title="Mobile View"
                    >
                        <Smartphone className="h-5 w-5" />
                    </button>
                </div>
                {}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex shrink-0 items-center justify-center px-8 py-3.5 text-base font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full md:w-auto"
                >
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <>
                            <Camera className="mr-2 h-5 w-5" />
                            Capture Analysis
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
