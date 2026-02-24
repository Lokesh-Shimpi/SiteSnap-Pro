import React from 'react';
const AiDoctorCard = ({ diagnosis, actionSteps }) => {
    if (!diagnosis) return null;
    return (
        <div className="mt-6 bg-[#0A0A0A] rounded-lg border border-slate-800 overflow-hidden shadow-lg font-mono text-sm">
            {}
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {}
                    <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 19.455L18 20.25l-.259-.795a1.25 1.25 0 00-.856-.856l-.795-.259.795-.259a1.25 1.25 0 00.856-.856l.259-.795.259.795a1.25 1.25 0 00.856.856l.795.259-.795.259a1.25 1.25 0 00-.856.856zM19.382 7.625l-.531-1.624a2.25 2.25 0 00-1.545-1.545L15.682 3.925l1.624-.531a2.25 2.25 0 001.545-1.545L19.382 .225l.531 1.624a2.25 2.25 0 001.545 1.545l1.624.531-1.624.531a2.25 2.25 0 00-1.545 1.545l-.531 1.624z" />
                    </svg>
                    <span className="text-indigo-400 font-semibold tracking-wide">AI Incident Doctor</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                </div>
            </div>
            {}
            <div className="p-5 text-slate-300 space-y-4">
                <div className="space-y-1">
                    <div className="flex gap-2 text-slate-500">
                        <span>$</span>
                        <span className="text-sky-400">diagnose --target=failure</span>
                    </div>
                    <p className="text-slate-100 pl-4 border-l-2 border-indigo-500/30">
                        {diagnosis}
                    </p>
                </div>
                {actionSteps && actionSteps.length > 0 && (
                    <div className="space-y-2 pt-2">
                        <div className="flex gap-2 text-slate-500">
                            <span>$</span>
                            <span className="text-emerald-400">cat recommended_actions.txt</span>
                        </div>
                        <ul className="pl-4 space-y-1">
                            {actionSteps.map((step, index) => (
                                <li key={index} className="flex gap-3 group">
                                    <span className="text-slate-600 select-none group-hover:text-slate-400 transition-colors">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <span className="text-emerald-100/90">{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="pt-2 animate-pulse text-slate-600">
                    <span>_</span>
                </div>
            </div>
        </div>
    );
};
export default AiDoctorCard;
