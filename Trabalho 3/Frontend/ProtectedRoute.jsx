import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/Projetos/To-Do-List/auth" replace />;
    }

    return children;
}

export default ProtectedRoute;
