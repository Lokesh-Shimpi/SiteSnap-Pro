import React, { useState } from 'react';
const VisualDiff = ({ baselineSrc, currentSrc, diffPercentage, status }) => {
    const [showOverlay, setShowOverlay] = useState(false);
    const isPending = status === 'Pending';
    const isDiffSignificant = diffPercentage > 10;
    const statusColor = isPending ? 'text-yellow-600 dark:text-yellow-500' : (isDiffSignificant ? 'text-red-600 dark:text-red-500' : 'text-green-600 dark:text-green-500');
    const badgeBg = isPending ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800' : (isDiffSignificant ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800');
    const displayStatus = isPending
        ? 'Pending'
        : (isDiffSignificant
            ? `Visual Shift Detected (${diffPercentage.toFixed(1)}% Diff)`
            : 'UI Stable');
    return (
        <div className="bg-white dark:bg-[#0a0f1d] rounded-2xl border border-slate-200 dark:border-gray-800 overflow-hidden shadow-lg transition-colors">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-gray-800 flex justify-between items-center bg-slate-50/80 dark:bg-[#0B1120]/50 backdrop-blur-sm transition-colors">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-300">Visual Regression Analysis</h3>
                <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeBg} ${statusColor} flex items-center gap-1.5`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isDiffSignificant ? 'bg-red-500 animate-pulse' : (isPending ? 'bg-yellow-500' : 'bg-green-500')}`}></span>
                    {displayStatus}
                </div>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                {}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">Baseline (Reference)</span>
                    </div>
                    <div className="relative aspect-video bg-slate-100 dark:bg-[#0B1120] rounded-xl border border-slate-200 dark:border-gray-800 overflow-hidden group transition-colors">
                        <img
                            src={baselineSrc || (isPending ? "https://placehold.co/600x400/94a3b8/ffffff?text=Pending+Calibration" : "https://placehold.co/600x400/94a3b8/ffffff?text=No+Baseline")}
                            alt="Baseline"
                            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/600x400/94a3b8/ffffff?text=Load+Error";
                            }}
                        />
                    </div>
                </div>
                {}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">Current Render</span>
                        <button
                            onClick={() => setShowOverlay(!showOverlay)}
                            className="text-xs text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors hidden md:block font-medium"
                        >
                            {showOverlay ? 'Hide Overlay' : 'Compare Overlay'}
                        </button>
                    </div>
                    <div className="relative aspect-video bg-slate-100 dark:bg-[#0B1120] rounded-xl border border-slate-200 dark:border-gray-800 overflow-hidden group transition-colors">
                        {}
                        {showOverlay && (
                            <img
                                src={baselineSrc}
                                alt="Baseline Overlay"
                                className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-difference pointer-events-none z-10"
                            />
                        )}
                        <img
                            src={currentSrc || (isPending ? "https://placehold.co/600x400/94a3b8/ffffff?text=Pending+Calibration" : "https://placehold.co/600x400/94a3b8/ffffff?text=Capture+Failed")}
                            alt="Current"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/600x400/94a3b8/ffffff?text=Load+Error";
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default VisualDiff;
