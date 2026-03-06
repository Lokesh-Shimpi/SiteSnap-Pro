import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function VerifyOtp() {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(60);
    const [resendStatus, setResendStatus] = useState('');

    const { verifyOtp, resendOtp } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Get email from query params
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const purpose = queryParams.get('purpose');

    const inputRefs = [
        useRef(null), useRef(null), useRef(null),
        useRef(null), useRef(null), useRef(null)
    ];

    useEffect(() => {
        if (!email || !purpose) {
            navigate('/signup');
        }
    }, [email, purpose, navigate]);

    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const handleChange = (index, value) => {
        // Only allow numbers
        if (!/^[0-9]*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1); // Only take last char if they try to type multiples
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Move to previous input on backspace if current is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();

        if (!/^[0-9]{6}$/.test(pastedData)) {
            setError('Please paste a valid 6-digit code');
            return;
        }

        const newOtp = pastedData.split('');
        setOtp(newOtp);
        inputRefs[5].current.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fullOtp = otp.join('');

        if (fullOtp.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await verifyOtp(email, fullOtp, purpose);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;

        setResendStatus('Sending...');
        setError('');

        try {
            await resendOtp(email, purpose);
            setResendStatus('Code resent successfully!');
            setResendCooldown(60);

            // Clear inputs
            setOtp(['', '', '', '', '', '']);
            inputRefs[0].current.focus();

            setTimeout(() => setResendStatus(''), 3000);
        } catch (err) {
            setResendStatus(''); // REMOVE 'Sending...' string on failure
            setError(err.response?.data?.message || 'Failed to resend code');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#0B1120] transition-colors duration-300">
            <div className="w-full max-w-md p-8 bg-white dark:bg-[#000000] rounded-2xl shadow-xl border border-slate-200 dark:border-gray-800 animate-fade-in-up">

                <div className="text-center mb-8">
                    <div className="inline-flex justify-center items-center h-16 w-16 rounded-full bg-indigo-50 dark:bg-indigo-500/10 mb-6 border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
                        <ShieldCheck className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Check your email</h2>
                    <p className="mt-3 text-slate-500 dark:text-slate-400 leading-relaxed">
                        We sent a 6-digit verification code to<br />
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{email}</span>
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 rounded-lg text-red-600 dark:text-red-200 text-sm text-center shadow-sm">
                        {error}
                    </div>
                )}

                {resendStatus && !error && (
                    <div className="mb-6 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/50 rounded-lg text-emerald-600 dark:text-emerald-400 text-sm text-center shadow-sm">
                        {resendStatus}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex justify-center gap-2 sm:gap-4" onPaste={handlePaste}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={inputRefs[index]}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold font-mono text-slate-900 dark:text-white bg-slate-50 dark:bg-[#000000] border border-slate-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                                required
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || otp.some(d => d === '')}
                        className="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/25 transition-all"
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                Verify Account
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Didn't receive the code?{' '}
                        {resendCooldown > 0 ? (
                            <span className="text-slate-400 dark:text-slate-500 text-sm">
                                Resend in <span className="font-mono font-medium">{resendCooldown}s</span>
                            </span>
                        ) : (
                            <button
                                onClick={handleResend}
                                type="button"
                                className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors focus:outline-none focus:underline"
                            >
                                Resend now
                            </button>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
