import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UrlInput from '../components/UrlInput';
import PreviewCard from '../components/PreviewCard';
import GlobalLatencyTable from '../components/GlobalLatencyTable';
import SiteVitalsCard from '../features/SiteVitalsCard';
import AuthContext from '../context/AuthContext';
import { Activity, Trash2, Search, X } from 'lucide-react';
import api from '../utils/api';
export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [screenshotUrl, setScreenshotUrl] = useState(null);
    const [analysisData, setAnalysisData] = useState(null);
    const [globalLatencyData, setGlobalLatencyData] = useState(null);
    const [loadingLatency, setLoadingLatency] = useState(false);
    const [error, setError] = useState(null);
    const [currentUrl, setCurrentUrl] = useState('');
    const [currentView, setCurrentView] = useState('desktop');
    const [showMonitorModal, setShowMonitorModal] = useState(false);
    const [newMonitorUrl, setNewMonitorUrl] = useState('');
    const handleCapture = async (url, view) => {
        setLoading(true);
        setLoadingLatency(true);
        setError(null);
        setScreenshotUrl(null);
        setAnalysisData(null);
        setGlobalLatencyData(null);
        setCurrentUrl(url);
        setCurrentView(view);
        api.get(`/api/tool/global-ping?url=${encodeURIComponent(url)}`)
            .then(res => setGlobalLatencyData(res.data.results))
            .catch(err => {
                console.error("Global Latency Error:", err);
                setGlobalLatencyData([]);
            })
            .finally(() => setLoadingLatency(false));
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            const screenshotRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/screenshot?url=${encodeURIComponent(url)}&view=${view}`, {
                headers
            });
            if (!screenshotRes.ok) {
                let errDetails = 'Failed to capture screenshot';
                try {
                    const errorData = await screenshotRes.json();
                    errDetails = errorData.error + (errorData.details ? ': ' + errorData.details : '');
                } catch (e) { }
                throw new Error(errDetails);
            }
            const blob = await screenshotRes.blob();
            setScreenshotUrl(URL.createObjectURL(blob));
            const analysisRes = await api.get(`/api/tool/analyze?url=${encodeURIComponent(url)}`);
            setAnalysisData(analysisRes.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };
    const [monitors, setMonitors] = useState([]);
    React.useEffect(() => {
        const fetchMonitors = async () => {
            try {
                const res = await api.get('/api/monitor');
                setMonitors(res.data);
            } catch (e) {
                console.error("Failed to fetch monitors", e);
            }
        };
        fetchMonitors();
    }, []);
    const handleCreateMonitor = async (url) => {
        try {
            const res = await api.post('/api/monitor', { url });
            navigate(`/monitor/${res.data._id}`);
        } catch (e) {
            console.error(e);
            alert("Failed to create monitor");
        }
    };
    const handleDeleteMonitor = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await api.delete(`/api/monitor/${id}`);
            setMonitors(monitors.filter(m => m._id !== id));
        } catch (err) {
            console.error(err);
            alert("Error deleting monitor");
        }
    };
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] transition-colors duration-300 flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                        Welcome back, <span className="font-medium text-slate-800 dark:text-slate-200">{user?.username}</span>. Monitor your digital assets.
                    </p>
                </div>
                <div className="mb-12 transition-all">
                    <UrlInput onCapture={handleCapture} isLoading={loading} />
                </div>
                {error && (
                    <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 dark:bg-red-500/10 dark:border-red-500/30 text-red-600 dark:text-red-200 text-center animate-shake mb-8 shadow-sm">
                        <p className="font-medium flex items-center justify-center gap-2">
                            <span>⚠️</span> {error}
                        </p>
                    </div>
                )}
                { }
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="text-emerald-500">●</span> Reliability Monitors
                        </h2>
                        { }
                    </div>
                    {monitors.length === 0 ? (
                        <div className="w-full bg-white dark:bg-[#000000] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 flex flex-col items-center justify-center text-slate-500 shadow-sm">
                            <p className="mb-4">No active monitors.</p>
                            <button onClick={() => setShowMonitorModal(true)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2">
                                + Add Monitor
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {monitors.map(m => (
                                <Link key={m._id} to={`/monitor/${m._id}`} className="block group relative">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl blur opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                                    <div className="relative bg-white dark:bg-[#000000] p-5 rounded-xl border border-slate-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500/50 transition-all shadow-sm">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-mono text-sm text-slate-600 dark:text-slate-300 truncate w-3/4">{m.url}</h3>
                                            <div className="flex items-center gap-2">
                                                <button onClick={(e) => handleDeleteMonitor(e, m._id)} className="text-slate-400 hover:text-red-500 transition-colors" title="Delete Monitor">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                                <span className={`w-2 h-2 rounded-full ${m.status === 'Healthy' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div className="text-xs text-slate-500">
                                                Last checked: {new Date(m.lastChecked).toLocaleTimeString()}
                                            </div>
                                            <div className="text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                                                View Report &rarr;
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            { }
                            <div className="relative group bg-slate-100 dark:bg-[#0a0f1d] p-5 rounded-xl border border-dashed border-slate-300 dark:border-gray-800 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-200 dark:hover:bg-[#0a0a0a] transition-colors cursor-pointer"
                                onClick={() => setShowMonitorModal(true)}
                            >
                                <span className="text-2xl mb-2">+</span>
                                <span className="text-sm font-medium">Add Monitor</span>
                            </div>
                        </div>
                    )}
                </div>
                { }
                {analysisData && analysisData.vitals && (
                    <div className="animate-fade-in-up mb-12">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> Site Vitals
                        </h2>
                        <SiteVitalsCard data={analysisData.vitals} />
                    </div>
                )}
                <div className="grid grid-cols-1 gap-10">
                    { }
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200">Live Preview</h3>
                        <div>
                            <div className="min-h-[350px]">
                                {(screenshotUrl || loading) && (
                                    <PreviewCard
                                        url={currentUrl}
                                        pingData={analysisData ? { status: analysisData.status, latency: analysisData.latency } : null}
                                        screenshotUrl={screenshotUrl}
                                        view={currentView}
                                    />
                                )}
                                {!screenshotUrl && !loading && (
                                    <div className="h-80 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 bg-white dark:bg-[#000000] rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm">
                                        <div className="p-4 bg-slate-50 dark:bg-gray-900 rounded-full mb-4 shadow-sm dark:shadow-inner border border-slate-100 dark:border-transparent">
                                            <Activity className="h-8 w-8 text-slate-400 dark:text-gray-500" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-600 dark:text-gray-400">No active session</p>
                                        <p className="text-xs mt-1 opacity-70">Enter a URL above to begin analysis</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        { }
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200">Global Latency</h3>
                            <div className="h-full">
                                {(globalLatencyData || loadingLatency) ? (
                                    <GlobalLatencyTable data={globalLatencyData || []} isLoading={loadingLatency} />
                                ) : (
                                    !loading && !loadingLatency && (
                                        <div className="h-80 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 bg-white dark:bg-[#000000] rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm">
                                            <p className="text-sm font-medium text-slate-600 dark:text-gray-400">Waiting for data...</p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {showMonitorModal && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 p-4 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm animate-fade-in-down" onClick={() => setShowMonitorModal(false)}>
                    <div className="w-full max-w-2xl bg-white dark:bg-[#0B1120] rounded-2xl shadow-2xl border border-slate-200 dark:border-gray-800 overflow-hidden transform transition-all" onClick={e => e.stopPropagation()}>
                        <div className="p-2 flex items-center bg-slate-50 dark:bg-[#000000] border-b border-slate-200 dark:border-gray-800">
                            <div className="pl-4 pr-3">
                                <Search className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
                            </div>
                            <input
                                autoFocus
                                type="url"
                                placeholder="Enter website URL (e.g., netflix.com)"
                                className="w-full bg-transparent border-none py-4 text-lg font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0"
                                value={newMonitorUrl}
                                onChange={(e) => setNewMonitorUrl(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && newMonitorUrl.trim()) {
                                        handleCreateMonitor(newMonitorUrl.trim());
                                        setShowMonitorModal(false);
                                        setNewMonitorUrl('');
                                    } else if (e.key === 'Escape') {
                                        setShowMonitorModal(false);
                                    }
                                }}
                            />

                            <button
                                onClick={() => setShowMonitorModal(false)}
                                className="sm:hidden p-2 mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="bg-white dark:bg-[#0B1120] p-4 flex flex-col sm:flex-row items-center justify-between">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 sm:mb-0 ml-4 flex items-center gap-2">
                                <Activity className="h-4 w-4" /> Real-time visual regression & latency tracking
                            </p>
                            <button
                                onClick={() => {
                                    if (newMonitorUrl.trim()) {
                                        handleCreateMonitor(newMonitorUrl.trim());
                                        setShowMonitorModal(false);
                                        setNewMonitorUrl('');
                                    }
                                }}
                                className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                            >
                                Track Site
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}
