import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Leaf, Zap, Bot, Github, Linkedin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import lokeshImage from '../assets/Lokesh_Shimpi.jpeg';
export default function About() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0B1120] transition-colors duration-300 font-sans flex flex-col relative overflow-hidden">
            {}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-white to-white dark:from-[#0a0a0a]/20 dark:via-black dark:to-black -z-10"></div>
            <Navbar />
            <main className="flex-grow">
                {}
                <header className="py-24 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight animate-fade-in-up">
                        Monitoring the web, <br className="hidden md:block" />without the noise.
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto animate-fade-in-up delay-100">
                        We believe enterprise-grade site reliability shouldn't require an enterprise budget. SiteSnap Pro was built to make advanced web diagnostics accessible, visual, and intelligent.
                    </p>
                </header>
                {}
                <section className="py-20 bg-slate-50 dark:bg-[#0B1120]/20 border-y border-slate-100 dark:border-gray-800/50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">The Origin Story</h2>
                            <p className="text-xl leading-relaxed">
                                It started with a simple frustration: standard ping tools were lying to us.
                            </p>
                            <p>
                                A server would return a <code className="font-mono text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">200 OK</code> status, but users were staring at a blank white screen due to a broken frontend build. We needed a tool that saw the web the way humans do.
                            </p>
                            <p>
                                So, we built a headless browser engine that doesn't just check if a site is online, but verifies it actually looks right—combining visual regression with automated AI diagnostics to solve <strong className="font-bold text-slate-900 dark:text-white">"Silent Downtime"</strong>.
                            </p>
                        </div>
                    </div>
                </section>
                {}
                <section className="py-24 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center tracking-tight">Behind the Code</h2>
                        <div className="bg-white dark:bg-[#000000] rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden flex flex-col md:flex-row items-center max-w-3xl mx-auto group">
                            <div className="md:w-1/3 bg-slate-100 dark:bg-[#0B1120] p-8 flex justify-center items-center self-stretch border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700">
                                <img
                                    src={lokeshImage}
                                    alt="Lokesh Shimpi"
                                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg ring-4 ring-white dark:ring-slate-800"
                                />
                            </div>
                            <div className="md:w-2/3 p-8 md:p-10 space-y-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Lokesh Shimpi</h3>
                                    <p className="text-indigo-600 dark:text-indigo-400 font-medium">Full-Stack Engineer & Creator</p>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
                                    A Computer Engineering student passionate about DevOps, Cloud Infrastructure, and building highly-optimized, zero-cost architectures. SiteSnap Pro was engineered to bridge the gap between complex server metrics and actionable developer workflows.
                                </p>
                                <div className="flex gap-4 pt-4">
                                    <a href="https://github.com/Lokesh-Shimpi" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-50 dark:bg-[#0B1120] text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors">
                                        <Github className="w-5 h-5" />
                                    </a>
                                    <a href="https://www.linkedin.com/in/lokesh-shimpi-83a0a02b2/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-50 dark:bg-[#0B1120] text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {}
                <section className="py-24 bg-slate-50 dark:bg-[#0B1120]/20 border-y border-slate-100 dark:border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Our Engineering Philosophy</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {}
                            <div className="p-8 bg-white dark:bg-[#000000] rounded-3xl border border-slate-200 dark:border-slate-700 hover:-translate-y-1 hover:shadow-lg transition-all group">
                                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6">
                                    <Leaf className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Green Computing</h3>
                                <p className="text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                                    We optimize our headless browser payloads and track carbon footprints because a faster web should also be a greener web.
                                </p>
                            </div>
                            {}
                            <div className="p-8 bg-white dark:bg-[#000000] rounded-3xl border border-slate-200 dark:border-slate-700 hover:-translate-y-1 hover:shadow-lg transition-all group">
                                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
                                    <Zap className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Zero-Bloat Architecture</h3>
                                <p className="text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                                    Built on a streamlined MERN stack with Dockerized microservices. No unnecessary dependencies. Just raw speed.
                                </p>
                            </div>
                            {}
                            <div className="p-8 bg-white dark:bg-[#000000] rounded-3xl border border-slate-200 dark:border-slate-700 hover:-translate-y-1 hover:shadow-lg transition-all group">
                                <div className="w-14 h-14 bg-violet-50 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center mb-6">
                                    <Bot className="w-7 h-7 text-violet-600 dark:text-violet-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI-Empowered</h3>
                                <p className="text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                                    We leverage LLMs not as a gimmick, but as a diagnostic assistant to turn raw error logs into actionable, 3-step DevOps workflows.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                {}
                <section className="py-24 bg-gradient-to-t from-white to-white dark:from-black dark:to-black text-center px-4 sm:px-6 lg:px-8 border-t border-slate-100 dark:border-gray-800">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Join the developers building<br className="hidden sm:block" /> a more reliable web.
                        </h2>
                        <div className="pt-4">
                            <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 hover:shadow-2xl hover:-translate-y-1 transition-all">
                                Start Analyzing Now
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
