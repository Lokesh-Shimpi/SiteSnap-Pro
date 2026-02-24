import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';

// Custom Hook for Animate Count Up on Scroll
function useCountUp(endValue, duration = 2000) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !hasAnimated.current) {
                setIsVisible(true);
                hasAnimated.current = true;
            }
        }, { threshold: 0.1 });

        if (elementRef.current) observer.observe(elementRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible || endValue === 0) return;

        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Ease out cubic function for premium deceleration feel
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOut * endValue));

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                setCount(endValue);
            }
        };
        requestAnimationFrame(step);

    }, [isVisible, endValue, duration]);

    return { count, elementRef };
}

import { Users, Activity, Globe } from 'lucide-react';

// Single Stat Component
const StatItem = ({ label, value, Icon, gradient }) => {
    const { count, elementRef } = useCountUp(value, 2000);

    return (
        <div ref={elementRef} className="flex flex-col items-center justify-center p-8 bg-white dark:bg-[#000000] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700/50">
                    <Icon className="h-5 w-5 text-indigo-500/80 dark:text-indigo-400" />
                </div>
                <span className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                    {label}
                </span>
            </div>

            <div className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
                {count.toLocaleString()}
            </div>
        </div>
    );
};

export default function LiveStatsBanner() {
    const [stats, setStats] = useState({
        registeredUsers: 0,
        totalScans: 0,
        uniqueSites: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/api/stats/public');
                const data = res.data;

                if (data && typeof data.registeredUsers !== 'undefined') {
                    setStats(data);
                }
            } catch (err) {
                console.error('Error fetching live stats:', err);
            }
        };

        fetchStats();
    }, []);

    return (
        <section className="w-full bg-slate-50 dark:bg-[#0B1120] border-t border-b border-slate-200 dark:border-slate-800 py-16 relative z-10 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatItem
                        label="Registered Users"
                        value={stats.registeredUsers}
                        Icon={Users}
                        gradient="from-indigo-400 to-violet-400"
                    />
                    <StatItem
                        label="Total Scans Run"
                        value={stats.totalScans}
                        Icon={Activity}
                        gradient="from-emerald-400 to-teal-400"
                    />
                    <StatItem
                        label="Unique Sites"
                        value={stats.uniqueSites}
                        Icon={Globe}
                        gradient="from-sky-400 to-blue-400"
                    />
                </div>
            </div>
        </section>
    );
}
