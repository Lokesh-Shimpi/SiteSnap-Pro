import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.get('/api/auth/me')
                .then(res => {
                    setUser(res.data);
                    setAuthError(null);
                })
                .catch((err) => {
                    console.error("Auth check failed", err);
                    if (err.response && err.response.status === 401) {
                        localStorage.removeItem('token');
                        setUser(null);
                    } else {
                        setAuthError("Unable to verify session. Server might be down.");
                    }
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);
    const login = async (email, password) => {
        const { data } = await api.post('/api/auth/login', { email, password });
        return data;
    };

    const register = async (username, email, password) => {
        const { data } = await api.post('/api/auth/register', { username, email, password });
        return data;
    };

    const verifyOtp = async (email, otp, purpose) => {
        const { data } = await api.post('/api/auth/verify-otp', { email, otp, purpose });
        if (data?.token) {
            localStorage.setItem('token', data.token);
            if (data.user) {
                setUser(data.user);
            } else {
                const me = await api.get('/api/auth/me');
                setUser(me.data);
            }
        }
        return data;
    };

    const resendOtp = async (email, purpose) => {
        const { data } = await api.post('/api/auth/resend-otp', { email, purpose });
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };
    return (
        <AuthContext.Provider value={{ user, login, register, verifyOtp, resendOtp, logout, loading, authError }}>
            {children}
        </AuthContext.Provider>
    );
};
export default AuthContext;
