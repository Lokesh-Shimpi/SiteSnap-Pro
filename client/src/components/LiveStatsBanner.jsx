import React, { useState, useEffect } from 'react';
import api from '../utils/api';

// Custom hook for smoothly animating numbers counting up
const useCountUp = (end, duration = 2000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime = null;
        let animationFrame;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            // Ease out exponentional for a natural deceleration effect
            const easeOutProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            setCount(Math.floor(easeOutProgress * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        if (end > 0) {
            animationFrame = requestAnimationFrame(animate);
        }

        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return count;
};

// Component for a single stat item
const StatItem = ({ label, value }) => {
    const animatedValue = useCountUp(value, 2500);

    return (
        <div className="flex flex-col items-center justify-center p-6 sm:p-8 animate-fade-in-up">
            <span className="text-4xl sm:text-5xl md:text-6xl font-mono font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-3 drop-shadow-sm">
                {animatedValue.toLocaleString()}{value > 0 ? "+" : ""}
            </span>
            <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-slate-400 uppercase text-center">
                {label}
            </span>
        </div>
    );
};

export default function LiveStatsBanner() {
    const [stats, setStats] = useState({
        registeredUsers: 0,
        totalScans: 0,
        uniqueWebsites: 0
    });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Fetch public stats securely cached on the backend
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/api/stats/public');
                setStats({
                    registeredUsers: data.registeredUsers || 0,
                    totalScans: data.totalScans || 0,
                    uniqueWebsites: data.uniqueWebsites || 0
                });
            } catch (error) {
                console.error("Failed to fetch public stats:", error);
            }
        };

        fetchStats();

        // Trigger the animation only when the user scrolls to see the banner
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        const element = document.getElementById('live-stats-banner');
        if (element) {
            observer.observe(element);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div id="live-stats-banner" className="w-full bg-slate-950 border-t border-b border-slate-800/50 py-8 lg:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {isVisible && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-800/50">
                        <StatItem label="Registered Devs" value={stats.registeredUsers} />
                        <StatItem label="Total Scans Run" value={stats.totalScans} />
                        <StatItem label="Sites Monitored" value={stats.uniqueWebsites} />
                    </div>
                )}
            </div>
        </div>
    );
}
