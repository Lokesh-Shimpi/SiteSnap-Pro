import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { UserPlus, Activity } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { user, register, googleLogin, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (!loading && user) {
            navigate('/dashboard');
        }
    }, [user, loading, navigate]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create account');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await googleLogin(credentialResponse.credential);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Google authentication failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#0B1120] transition-colors duration-300">
            <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-[#000000] rounded-2xl shadow-xl border border-slate-200 dark:border-gray-800 animate-fade-in-up">
                <div className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <Activity className="h-6 w-6 text-indigo-600 dark:text-indigo-500" />
                        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-500 tracking-tight">SiteSnap Pro</h1>
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Create Account</h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Join SiteSnap Pro today</p>
                </div>
                {error && <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 rounded text-red-600 dark:text-red-200 text-sm text-center shadow-sm">{error}</div>}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 dark:border-gray-700 placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white bg-white dark:bg-[#0B1120] rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 dark:border-gray-700 placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white bg-white dark:bg-[#0B1120] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 dark:border-gray-700 placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white bg-white dark:bg-[#0B1120] rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-indigo-500/20 transition-all"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <UserPlus className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
                            </span>
                            Sign Up
                        </button>
                    </div>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-300 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-[#000000] text-slate-500">Or continue with</span>
                    </div>
                </div>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => {
                            setError('Google authentication failed');
                        }}
                    />
                </div>

                <div className="text-center text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Already have an account? </span>
                    <Link to="/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}
