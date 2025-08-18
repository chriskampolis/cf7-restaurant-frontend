import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { type ReactNode, useState, useEffect } from 'react';
import api from '../services/api';

interface JwtPayload {
  exp: number; 
}

function ProtectedRoute({ children }: { children: ReactNode }) {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

    const refreshToken = async () => {
        const refreshToken =  localStorage.getItem('refresh_token');
        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken
            });
            if (res.status === 200) {
                localStorage.setItem('access_token', res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false)
        }
    }

    const auth = async () => {
        const token = localStorage.getItem('access_token')
        if (!token) {
            setIsAuthorized(false)
            return
        }
        const decoded = jwtDecode<JwtPayload>(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000 

        if (tokenExpiration < now) {
            await refreshToken() 
        } else {
            setIsAuthorized(true)
        }
    }

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false));
    }, []);

    if (isAuthorized === null) {
      // still checking token → show spinner / loader instead of redirect
      return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute;