import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ImagePlus, Bot, Leaf, BookOpen, Search, Globe, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function Features() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0B1120] transition-colors duration-300 font-sans flex flex-col">
            <Navbar />
            <main className="flex-grow">
                { }
                <header className="py-24 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight animate-fade-in-up">
                        Enterprise-Grade Reliability, <br className="hidden md:block" />Built for Modern Teams.
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto animate-fade-in-up delay-100">
                        From pixel-perfect visual regression to AI-driven root cause analysis, discover the tools that keep your websites fast, secure, and online.
                    </p>
                </header>
                { }
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
                        { }
                        <article className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
                            <div className="flex-1 space-y-6">
                                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
                                    <Search className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                                    Synthetic Monitoring
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                                    Instant headless browser snapshots and uptime pinging to ensure your site is always available.
                                </p>
                            </div>
                            <div className="flex-1 w-full bg-slate-50 dark:bg-[#000000] rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden relative min-h-[300px] flex items-center justify-center group">
                                <div className="w-full max-w-md bg-white dark:bg-[#0B1120] p-6 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm font-mono text-sm text-slate-600 dark:text-slate-300">
                                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-gray-800 pb-2">
                                        <span className="text-slate-900 dark:text-white font-bold">GET /api/health</span>
                                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-md text-xs">200 OK</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between"><span>DNS Lookup:</span><span>12ms</span></div>
                                        <div className="flex justify-between"><span>TCP Connection:</span><span>22ms</span></div>
                                        <div className="flex justify-between"><span>TLS Handshake:</span><span>35ms</span></div>
                                        <div className="flex justify-between font-bold text-indigo-500 pt-2 border-t border-slate-100 dark:border-gray-800 mt-2"><span>Total Time:</span><span>69ms</span></div>
                                    </div>
                                </div>
                            </div>
                        </article>
                        { }
                        <article className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                            <div className="flex-1 space-y-6">
                                <div className="w-16 h-16 bg-pink-50 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center">
                                    <Globe className="w-8 h-8 text-pink-600 dark:text-pink-400" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                                    Global Latency
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                                    Simulated multi-region routing analysis tracking Round Trip Time (RTT) and Packet Loss.
                                </p>
                            </div>
                            <div className="flex-1 w-full bg-slate-50 dark:bg-[#000000] rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden relative min-h-[300px] flex items-center justify-center group">
                                <div className="w-full max-w-md bg-white dark:bg-[#0B1120] p-6 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm space-y-4 font-mono text-sm text-slate-600 dark:text-slate-300">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> us-east-1</div>
                                        <span className="text-green-500 font-bold">45ms</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> eu-central-1</div>
                                        <span className="text-green-500 font-bold">112ms</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> ap-southeast-2</div>
                                        <span className="text-yellow-500 font-bold">245ms</span>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-slate-100 dark:border-gray-800 pt-3 mt-1">
                                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> sa-east-1</div>
                                        <span className="text-red-500 font-bold">Timeout</span>
                                    </div>
                                </div>
                            </div>
                        </article>
                        { }
                        <article className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
                            <div className="flex-1 space-y-6">
                                <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                                    <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                                    Security Vitals
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                                    Automated SSL/TLS certificate validation and expiry tracking to prevent highly embarrassing outages.
                                </p>
                            </div>
                            <div className="flex-1 w-full bg-slate-50 dark:bg-[#000000] rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden relative min-h-[300px] flex items-center justify-center group">
                                <div className="w-full max-w-md bg-white dark:bg-[#0B1120] p-6 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm font-mono text-sm text-slate-600 dark:text-slate-300">
                                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-gray-800 pb-4">
                                        <Shield className="w-6 h-6 text-green-500" />
                                        <span className="text-lg font-bold text-slate-900 dark:text-white">Certificate Valid</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex flex-col"><span className="text-slate-400 text-xs uppercase tracking-wider mb-1">Common Name</span><span className="font-semibold text-slate-700 dark:text-slate-200">*.sitesnappro.com</span></div>
                                        <div className="flex flex-col"><span className="text-slate-400 text-xs uppercase tracking-wider mb-1">Issuer</span><span className="font-semibold text-slate-700 dark:text-slate-200">Let's Encrypt Authority X3</span></div>
                                        <div className="flex flex-col"><span className="text-slate-400 text-xs uppercase tracking-wider mb-1">Expires</span><span className="font-semibold text-green-500">45 days (Oct 12, 2026)</span></div>
                                    </div>
                                </div>
                            </div>
                        </article>
                        { }
                        <article className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                            <div className="flex-1 space-y-6">
                                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
                                    <ImagePlus className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                                    Visual Regression Engine
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                                    Stop silent UI failures. We compare baseline snapshots against live DOM renders down to the pixel, alerting you to broken CSS or missing assets even when the server returns 200 OK.
                                </p>
                            </div>
                            <div className="flex-1 w-full bg-slate-50 dark:bg-[#000000] rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden relative min-h-[300px] flex items-center justify-center group">
                                <div className="text-center font-mono text-sm sm:text-base text-slate-600 dark:text-slate-300">
                                    <div className="mb-2 text-indigo-500">Comparing images...</div>
                                    <div className="text-red-500 dark:text-red-400">- 450 pixels changed</div>
                                    <div className="text-green-500 dark:text-green-400">+ 450 pixels changed</div>
                                    <div className="mt-4 text-xs text-slate-400">&gt; Check failed. Visual drift detected.</div>
                                </div>
                            </div>
                        </article>
                        { }
                        <article className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
                            <div className="flex-1 space-y-6">
                                <div className="w-16 h-16 bg-violet-50 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center">
                                    <Bot className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                                    AI Incident Doctor (Powered by Gemini)
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                                    Don't just detect downtime—diagnose it. Our integrated LLM analyzes HTTP status codes and visual drift to generate instant, 3-step root cause analysis and action plans.
                                </p>
                            </div>
                            <div className="flex-1 w-full bg-slate-50 dark:bg-[#000000] rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden relative min-h-[300px] flex items-center justify-center group">
                                <div className="text-left font-mono text-sm sm:text-base text-slate-600 dark:text-slate-300 space-y-2 w-full max-w-md bg-white dark:bg-[#0B1120] p-6 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm">
                                    <div className="text-violet-500 font-bold mb-4">Gemini Analysis</div>
                                    <div>&gt; Root Cause: 502 Bad Gateway</div>
                                    <div>&gt; Analysis: Upstream server is down. Next.js application container likely crashed out of memory.</div>
                                    <div className="text-slate-400 mt-4">Recommendation: Restart the container and allocate more RAM in docker-compose.yml.</div>
                                </div>
                            </div>
                        </article>
                        { }
                        <article className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                            <div className="flex-1 space-y-6">
                                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
                                    <Leaf className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                                    Green Computing & Carbon Footprint
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                                    Measure your environmental impact. We calculate precise CO2 emissions based on page payload using Sustainable Web Design models, helping you build a greener web.
                                </p>
                            </div>
                            <div className="flex-1 w-full bg-slate-50 dark:bg-[#000000] rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden relative min-h-[300px] flex items-center justify-center group">
                                <div className="text-center font-mono text-sm sm:text-base text-slate-600 dark:text-slate-300">
                                    <div className="text-4xl mb-2">🌿</div>
                                    <div className="text-lg font-bold text-slate-800 dark:text-white">0.45g CO2</div>
                                    <div className="text-sm text-slate-500 mt-1">per page visit</div>
                                    <div className="mt-4 text-xs text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-4">Cleaner than 75% of websites tested.</div>
                                </div>
                            </div>
                        </article>
                        { }
                        <article className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
                            <div className="flex-1 space-y-6">
                                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                                    <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                                    Engineering Community Blog
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                                    Share post-mortems and performance tips. A built-in developer community featuring rich text publishing, real-time likes, and feed sorting.
                                </p>
                            </div>
                            <div className="flex-1 w-full bg-slate-50 dark:bg-[#000000] rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden relative min-h-[300px] flex items-center justify-center group">
                                <div className="w-full max-w-md bg-white dark:bg-[#0B1120] p-6 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm text-left">
                                    <div className="h-4 bg-slate-200 dark:bg-[#000000] rounded w-3/4 mb-4"></div>
                                    <div className="h-3 bg-slate-100 dark:bg-[#000000]/50 rounded w-full mb-2"></div>
                                    <div className="h-3 bg-slate-100 dark:bg-[#000000]/50 rounded w-5/6 mb-6"></div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </section>
                <section className="py-24 bg-gradient-to-t from-slate-50 to-white dark:from-black/40 dark:to-black text-center px-4 sm:px-6 lg:px-8 border-t border-slate-100 dark:border-gray-800">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Ready to secure your site?
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Join many developers using SiteSnap Pro to detect issues before their users do.
                        </p>
                        <div className="pt-4">
                            <Link to="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 hover:shadow-2xl hover:-translate-y-1 transition-all">
                                Start Analyzing for Free
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div >
    );
}
