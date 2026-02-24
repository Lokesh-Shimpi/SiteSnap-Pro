import React from 'react';
import { Shield, ShieldAlert, Zap, FileJson, Clock, Lock, Leaf } from 'lucide-react';
export default function SiteVitalsCard({ data }) {
    if (!data) return null;
    const { ssl, performance } = data;
    const getSslColor = (valid, days) => {
        if (!valid) return 'text-red-600 dark:text-red-500';
        if (days < 30) return 'text-yellow-600 dark:text-yellow-500';
        return 'text-green-600 dark:text-green-500';
    };
    const getLoadTimeColor = (time) => {
        if (time < 1.5) return 'text-green-600 dark:text-green-400';
        if (time < 3.0) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };
    const getPageSizeColor = (sizeMb) => {
        if (sizeMb < 1) return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]';
        if (sizeMb < 3) return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]';
        return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]';
    };
    const getCarbonColor = (grams) => {
        if (grams == null) return 'text-slate-500';
        if (grams < 0.5) return 'text-green-600 dark:text-green-400';
        if (grams > 1.5) return 'text-orange-600 dark:text-orange-500';
        return 'text-slate-900 dark:text-white';
    };
    const getCarbonIconBg = (grams) => {
        if (grams == null) return 'bg-slate-200/50 dark:bg-slate-500/10 border-slate-300/50 dark:border-slate-500/20';
        if (grams < 0.5) return 'bg-green-200/50 dark:bg-green-500/10 border-green-300/50 dark:border-green-500/20';
        if (grams > 1.5) return 'bg-orange-200/50 dark:bg-orange-500/10 border-orange-300/50 dark:border-orange-500/20';
        return 'bg-emerald-200/50 dark:bg-emerald-500/10 border-emerald-300/50 dark:border-emerald-500/20';
    };
    const getCarbonIconColor = (grams) => {
        if (grams == null) return 'text-slate-500';
        if (grams < 0.5) return 'text-green-600 dark:text-green-400';
        if (grams > 1.5) return 'text-orange-600 dark:text-orange-500';
        return 'text-emerald-600 dark:text-emerald-400';
    };
    const pageSizeMb = parseFloat(performance?.pageSizeMb || 0);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {}
            <div className="bg-gray-100 dark:bg-[#0B1120]/80 backdrop-blur-lg border border-gray-200 dark:border-gray-500/50 rounded-2xl p-5 shadow-lg dark:shadow-[0_0_20px_rgba(59,130,246,0.2)] relative overflow-hidden group hover:border-indigo-500/30 transition-all">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Lock className="h-16 w-16 text-slate-800 dark:text-white" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                    {ssl?.valid ? (
                        <div className="p-2 bg-green-200/50 dark:bg-green-500/10 rounded-lg border border-green-300/50 dark:border-green-500/20">
                            <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                    ) : (
                        <div className="p-2 bg-red-200/50 dark:bg-red-500/10 rounded-lg border border-red-300/50 dark:border-red-500/20">
                            <ShieldAlert className="h-6 w-6 text-red-600 dark:text-red-500" />
                        </div>
                    )}
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Security</h3>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Issuer</span>
                        <span className="text-slate-900 dark:text-slate-200 truncate max-w-[150px]" title={ssl?.issuer}>{ssl?.issuer || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Expires In</span>
                        <span className={`font-mono font-medium ${getSslColor(ssl?.valid, ssl?.daysRemaining)}`}>
                            {ssl?.daysRemaining >= 0 ? `${ssl.daysRemaining} days` : 'Expired'}
                        </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-300 dark:border-slate-700/50 flex items-center justify-between text-xs text-slate-600 dark:text-slate-500">
                        <span>Valid From:</span>
                        <span>{ssl?.validFrom || 'N/A'}</span>
                    </div>
                </div>
            </div>
            {}
            <div className="bg-gray-100 dark:bg-[#0B1120]/80 backdrop-blur-lg border border-gray-200 dark:border-gray-500/50 rounded-2xl p-5 shadow-lg dark:shadow-[0_0_20px_rgba(59,130,246,0.2)] relative overflow-hidden group hover:border-indigo-500/30 transition-all">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap className="h-16 w-16 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-yellow-200/50 dark:bg-yellow-500/10 rounded-lg border border-yellow-300/50 dark:border-yellow-500/20">
                        <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Performance</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-slate-600 dark:text-slate-400 text-sm">Main Load Time</span>
                        <span className={`text-2xl font-bold ${getLoadTimeColor(performance?.loadTime || 0)}`}>
                            {performance?.loadTime}s
                        </span>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                            <span>Requests</span>
                            <span>{performance?.requestCount} total</span>
                        </div>
                        <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="bg-indigo-500 h-1.5 rounded-full"
                                style={{ width: `${Math.min(performance?.requestCount || 0, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
            {}
            <div className="bg-gray-100 dark:bg-[#0B1120]/80 backdrop-blur-lg border border-gray-200 dark:border-gray-500/50 rounded-2xl p-5 shadow-lg dark:shadow-[0_0_20px_rgba(59,130,246,0.2)] relative overflow-hidden group hover:border-indigo-500/30 transition-all">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <FileJson className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-200/50 dark:bg-blue-500/10 rounded-lg border border-blue-300/50 dark:border-blue-500/20">
                        <FileJson className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Page Weight</h3>
                </div>
                <div className="flex flex-col justify-between h-[100px]">
                    <div className="text-center py-2">
                        <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{pageSizeMb.toFixed(2)}</span>
                        <span className="text-slate-600 dark:text-slate-400 ml-2 text-lg">MB</span>
                    </div>
                    <div className="space-y-2">
                        <div className="w-full bg-slate-300 dark:bg-slate-700/50 rounded-full h-3 p-0.5 backdrop-blur-sm border border-slate-400 dark:border-slate-600/30">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${getPageSizeColor(pageSizeMb)}`}
                                style={{ width: `${Math.min((pageSizeMb / 5) * 100, 100)}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-500 px-1">
                            <span>0 MB</span>
                            <span>Target: &lt;2 MB</span>
                            <span>5+ MB</span>
                        </div>
                    </div>
                </div>
            </div>
            {}
            <div className="bg-gray-100 dark:bg-[#0B1120]/80 backdrop-blur-lg border border-gray-200 dark:border-gray-500/50 rounded-2xl p-5 shadow-lg dark:shadow-[0_0_20px_rgba(59,130,246,0.2)] relative overflow-hidden group hover:border-indigo-500/30 transition-all">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Leaf className={`h-16 w-16 ${getCarbonIconColor(performance?.carbonFootprintGrams)}`} />
                </div>
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg border ${getCarbonIconBg(performance?.carbonFootprintGrams)}`}>
                        <Leaf className={`h-6 w-6 ${getCarbonIconColor(performance?.carbonFootprintGrams)}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Carbon Footprint</h3>
                </div>
                <div className="flex flex-col justify-between h-[100px]">
                    <div className="text-center py-2">
                        <span className={`text-4xl font-extrabold tracking-tight ${getCarbonColor(performance?.carbonFootprintGrams)}`}>
                            {performance?.carbonFootprintGrams != null ? performance.carbonFootprintGrams : '--'}
                        </span>
                        <span className="text-slate-600 dark:text-slate-400 ml-1 text-lg">g CO₂</span>
                    </div>
                    <div className="space-y-2 mt-auto">
                        <div className="flex justify-center text-xs text-slate-600 dark:text-slate-500 px-1 py-1 rounded bg-slate-200/50 dark:bg-[#000000]/30 border border-slate-300/30 dark:border-slate-700/50">
                            <span>Estimated emissions per visit</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
