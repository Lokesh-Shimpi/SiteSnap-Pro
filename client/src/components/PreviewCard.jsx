import React from 'react';
import { Download, ExternalLink, Clock, Wifi, WifiOff } from 'lucide-react';
export default function PreviewCard({ url, pingData, screenshotUrl, view }) {
    if (!screenshotUrl && !pingData) return null;
    const isOnline = pingData?.status === 'Online';
    const getHostname = (urlString) => {
        try {
            const urlToParse = /^https?:\/\//i.test(urlString) ? urlString : `https://${urlString}`;
            return new URL(urlToParse).hostname;
        } catch (e) {
            return urlString;
        }
    };
    const hostname = getHostname(url);
    return (
        <div className="w-full mt-2 bg-white dark:bg-[#000000] rounded-xl shadow-sm overflow-hidden border border-slate-200 dark:border-gray-800 animate-fade-in-up">
            {}
            <div className="bg-slate-50 dark:bg-[#0B1120] px-6 py-4 border-b border-slate-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`}></div>
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white tracking-wide">{hostname}</h2>
                    <a href={url.startsWith('http') ? url : `https://${url}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-400">
                        <ExternalLink className="h-4 w-4" />
                    </a>
                </div>
                {pingData && (
                    <div className="flex items-center gap-4 text-sm font-medium">
                        <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${isOnline ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                            <span>{pingData.status}</span>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-slate-200 dark:bg-gray-800 text-slate-700 dark:text-gray-200 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{pingData.latency}ms</span>
                        </div>
                    </div>
                )}
            </div>
            {}
            <div className="p-6 bg-white dark:bg-[#0B1120] flex justify-center items-center min-h-[300px]">
                {screenshotUrl ? (
                    <div className={`relative rounded-lg overflow-hidden shadow-xl border border-slate-300 dark:border-gray-700 transition-all duration-500 ${view === 'mobile' ? 'max-w-[300px]' : 'w-full'}`}>
                        {}
                        <img
                            src={screenshotUrl}
                            alt={`Screenshot of ${url}`}
                            className="w-full h-auto object-contain block"
                        />
                    </div>
                ) : (
                    <div className="text-slate-500 flex flex-col items-center">
                        <div className="animate-pulse h-64 w-full bg-gray-700 dark:bg-[#000000] rounded-lg"></div>
                        <p className="mt-4">Loading preview...</p>
                    </div>
                )}
            </div>
            {}
            {screenshotUrl && (
                <div className="bg-slate-50 dark:bg-[#0B1120] px-6 py-4 border-t border-slate-200 dark:border-gray-800 flex justify-end">
                    <a
                        href={screenshotUrl}
                        download={`sitesnap-${hostname}-${view}.png`}
                        className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-indigo-500/20"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download Snapshot
                    </a>
                </div>
            )}
        </div>
    );
}
