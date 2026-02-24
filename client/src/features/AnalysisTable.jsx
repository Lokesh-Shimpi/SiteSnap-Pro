import React from 'react';
export default function AnalysisTable({ data, isLoading }) {
    if (!isLoading && (!data || data.length === 0)) return null;
    return (
        <div className="bg-white dark:bg-[#000000] rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#0B1120]">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Global Latency Analysis</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-gray-800">
                    <thead className="bg-slate-50 dark:bg-[#0f0f0f]">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Location</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">IP</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Packet Loss</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Min (ms)</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Avg (ms)</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Max (ms)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-[#0B1120] divide-y divide-slate-200 dark:divide-gray-800">
                        {isLoading ? (
                            <>
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-sm font-medium text-indigo-500 animate-pulse bg-indigo-50/50 dark:bg-indigo-900/10">
                                        Probing global edge servers...
                                    </td>
                                </tr>
                                {Array.from({ length: 5 }).map((_, idx) => (
                                    <tr key={`skeleton-${idx}`} className={idx % 2 === 0 ? 'bg-white dark:bg-[#0B1120]' : 'bg-slate-50 dark:bg-[#000000]'}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-4 bg-slate-200 dark:bg-gray-800 rounded w-24 animate-pulse"></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-4 bg-slate-200 dark:bg-gray-800 rounded w-20 animate-pulse"></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-5 bg-slate-300 dark:bg-gray-700 rounded-full w-16 animate-pulse"></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-4 bg-slate-200 dark:bg-gray-800 rounded w-12 animate-pulse"></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-4 bg-slate-200 dark:bg-gray-800 rounded w-12 animate-pulse"></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-4 bg-slate-300 dark:bg-gray-700 rounded w-14 animate-pulse"></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-4 bg-slate-200 dark:bg-gray-800 rounded w-12 animate-pulse"></div>
                                        </td>
                                    </tr>
                                ))}
                            </>
                        ) : (
                            data.map((row, idx) => (
                                <tr key={idx} className={idx % 2 === 0 ? 'bg-white dark:bg-[#0B1120]' : 'bg-slate-50 dark:bg-[#000000]'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                        <img
                                            src={`https://flagcdn.com/24x18/${row.countryCode.toLowerCase()}.png`}
                                            alt={row.countryCode}
                                            className="rounded-sm"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                        {row.location}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-mono">
                                        {row.ip || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.status === 'Up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500 font-bold'}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 font-mono">{row.packetLoss}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 font-mono">{row.min}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white font-mono font-bold">{row.avg}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 font-mono">{row.max}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
