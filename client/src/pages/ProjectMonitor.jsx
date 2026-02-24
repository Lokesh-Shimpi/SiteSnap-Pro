import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VisualDiff from '../components/VisualDiff';
import AiDoctorCard from '../components/AiDoctorCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';

const ProjectMonitor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checking, setChecking] = useState(false);
    const [error, setError] = useState(null);
    const fetchProject = async () => {
        try {
            const res = await api.get(`/api/monitor/${id}`);
            setProject(res.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (id) fetchProject();
    }, [id]);
    const handleRunCheck = async () => {
        setChecking(true);
        try {
            await api.post(`/api/monitor/${id}/check`);
            await fetchProject();
        } catch (err) {
            console.error(err);
            alert('Failed to run check');
        } finally {
            setChecking(false);
        }
    };
    if (loading) return <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-indigo-600 dark:text-indigo-400 flex items-center justify-center">Loading Monitor...</div>;
    if (error) return <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-red-600 dark:text-red-400 flex items-center justify-center">{error}</div>;
    if (!project) return <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-500 dark:text-slate-400 flex items-center justify-center">Project not found</div>;
    const { status, url, lastCheckResult } = project;
    const diffPercentage = lastCheckResult?.visualDiffPercentage || 0;
    const diagnosis = lastCheckResult?.diagnosis?.diagnosis;
    const actionSteps = lastCheckResult?.diagnosis?.actionSteps;
    const timestamp = new Date().getTime();
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const isPending = status === 'Pending';
    const baselineSrc = !isPending ? `${apiUrl}/api/monitor/${id}/image/baseline?t=${timestamp}` : null;
    const currentSrc = !isPending ? `${apiUrl}/api/monitor/${id}/image/current?t=${timestamp}` : null;
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] transition-colors duration-300 flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
                { }
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Reliability Suite
                        </h1>
                        <p className="text-slate-600 dark:text-slate-500 mt-1 flex items-center gap-2">
                            Monitoring: <span className="text-slate-700 dark:text-slate-300 font-mono bg-white dark:bg-[#0B1120] px-2 py-0.5 rounded border border-slate-300 dark:border-gray-500">{url}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${status === 'Healthy' ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800 text-green-600 dark:text-green-400' :
                            status === 'Down' ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400' :
                                'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800 text-yellow-600 dark:text-yellow-500 font-bold'
                            }`}>
                            {status?.toUpperCase()}
                        </span>
                        <button
                            onClick={handleRunCheck}
                            disabled={checking}
                            className={`px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 ${checking ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {checking ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Analyzing...
                                </>
                            ) : (
                                'Run Calibration Check'
                            )}
                        </button>
                    </div>
                </div>
                { }
                <div className="grid grid-cols-1 gap-8">
                    { }
                    <div className="space-y-6">
                        <VisualDiff
                            baselineSrc={baselineSrc}
                            currentSrc={currentSrc}
                            diffPercentage={diffPercentage}
                            status={status}
                        />
                    </div>
                    { }
                    <div className="space-y-6">
                        {diagnosis ? (
                            <AiDoctorCard
                                diagnosis={diagnosis}
                                actionSteps={actionSteps}
                            />
                        ) : (
                            <div className="bg-white dark:bg-[#000000] rounded-xl border border-slate-200 dark:border-gray-500 p-8 flex flex-col items-center justify-center text-center min-h-[200px] text-slate-600 dark:text-slate-500 shadow-sm transition-all hover:border-indigo-400/30">
                                <svg className="w-12 h-12 mb-4 text-green-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-xl font-medium text-slate-800 dark:text-slate-200">System is healthy.</p>
                                <p className="text-sm mt-2">No active incidents requiring AI diagnosis.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
export default ProjectMonitor;
