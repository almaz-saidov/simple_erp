import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    element: React.ReactElement;
    allowedStatuses: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, allowedStatuses }) => {
    const userStatus = localStorage.getItem('user_status');

    if (userStatus && allowedStatuses.includes(userStatus)) {
        return element;
    } else {
        return <Navigate to="/markets" />;
    }
};

export default ProtectedRoute;