import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LiveStatsBanner from '../components/LiveStatsBanner';
import { Activity, Globe, CheckCircle, ArrowRight, Camera, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export default function Home() {
    const { user, loading } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#000000] transition-colors duration-300 font-sans flex flex-col">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section - Split Layout */}
                <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden bg-white dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                            {/* Text Content */}
                            <div className="text-center lg:text-left">
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                                    Global Monitoring.<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                                        Zero Latency.
                                    </span>
                                </h1>
                                <p className="mt-6 text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                    Capture pixel-perfect screenshots, analyze global latency, and monitor SSL health from 8 regions worldwide. Built for engineering teams who demand precision.
                                </p>
                                <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                                    {!loading && user ? (
                                        <Link to="/dashboard" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-lg font-semibold shadow-md shadow-indigo-200 dark:shadow-none transition-all duration-200 flex items-center justify-center gap-2 group">
                                            Go to Dashboard
                                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    ) : (
                                        <>
                                            <Link to="/signup" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-lg font-semibold shadow-md shadow-indigo-200 dark:shadow-none transition-all duration-200">
                                                Start Monitoring Free
                                            </Link>
                                            <Link to="/login" className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center">
                                                View Live Demo
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Hero Image */}
                            <div className="relative mx-auto w-full max-w-lg lg:max-w-none mt-8 lg:mt-0">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                                    <div className="absolute inset-0 bg-indigo-500/10 mix-blend-multiply z-10 transition-colors duration-300"></div>
                                    <img
                                        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                                        alt="Global Network Connectivity"
                                        className="w-full h-[400px] object-cover transform hover:scale-105 transition-transform duration-700"
                                    />
                                    {/* Glassmorphism float tag */}
                                    <div className="absolute bottom-6 left-6 z-20 bg-white/20 dark:bg-[#0B1120]/40 backdrop-blur-md border border-white/50 dark:border-slate-700/50 rounded-xl p-4 shadow-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                                <Activity className="h-5 w-5 text-emerald-400 dark:text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium text-sm drop-shadow-md">Global Ping Data</p>
                                                <p className="text-emerald-300 dark:text-emerald-400 font-bold text-lg drop-shadow-md">Active Tracking</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <LiveStatsBanner />

                {/* Alternating Feature Sections */}
                <section className="py-24 bg-slate-50 dark:bg-[#000000] border-t border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">

                        {/* Feature 1 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="order-2 lg:order-1 relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
                                <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop" alt="Code on Monior" className="w-full h-[450px] object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/50 to-transparent"></div>
                            </div>
                            <div className="order-1 lg:order-2">
                                <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 rounded-xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
                                    <Camera className="h-6 w-6" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Pixel-Perfect Visual Regression.</h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                                    Deploy with confidence. Our high-performance headless browser cluster captures snapshot comparisons of your UI prior to release, catching CSS drift and missing elements before your users do.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                        <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                                        <span>Automated baseline comparisons on every commit.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                        <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                                        <span>Mobile & Desktop viewport resolution support.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="h-12 w-12 bg-rose-100 dark:bg-rose-900/50 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center justify-center mb-6 text-rose-600 dark:text-rose-400">
                                    <Globe className="h-6 w-6" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Global Edge Network.</h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                                    Your application might be fast in New York, but what about Tokyo? We ping your endpoints from 8 distinct geographies around the world simultaneously to provide raw, unvarnished latency data.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                        <CheckCircle className="h-6 w-6 text-rose-500 flex-shrink-0" />
                                        <span>Real-time latency metrics from US, EU, and Asia.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                        <CheckCircle className="h-6 w-6 text-rose-500 flex-shrink-0" />
                                        <span>Detect regional routing anomalies.</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
                                <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop" alt="Server Data Center" className="w-full h-[450px] object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 to-transparent"></div>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="order-2 lg:order-1 relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
                                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" alt="Data Analytics Graphs" className="w-full h-[450px] object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 to-transparent"></div>
                            </div>
                            <div className="order-1 lg:order-2">
                                <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
                                    <BarChart3 className="h-6 w-6" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Performance Vitals.</h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                                    Track beyond just uptime. We analyze your website's fundamental vital signs including SSL certificate health, total page load sizes, and DNS resolution bottlenecks over time.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                        <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                                        <span>SSL Expiry tracking before disaster strikes.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                        <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                                        <span>Historical performance plotting and degradation alerts.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
