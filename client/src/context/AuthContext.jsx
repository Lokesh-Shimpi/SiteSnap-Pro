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
        if (data.token) {
            localStorage.setItem('token', data.token);
            setUser(data);
        }
        return data;
    };

    const register = async (username, email, password) => {
        const { data } = await api.post('/api/auth/register', { username, email, password });
        // OTP flow: user is not technically "logged in" yet
        if (data.token) {
            localStorage.setItem('token', data.token);
            setUser(data);
        }
        return data;
    };

    const googleLogin = async (token) => {
        const { data } = await api.post('/api/auth/google', { token });
        localStorage.setItem('token', data.token);
        setUser(data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };
    return (
        <AuthContext.Provider value={{ user, login, register, googleLogin, logout, loading, authError }}>
            {children}
        </AuthContext.Provider>
    );
};
export default AuthContext;
