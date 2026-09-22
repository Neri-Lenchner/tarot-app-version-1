import { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { authStore } from '../state/auth-state';

interface AdminRouteProps {
    child: JSX.Element;
}

function AdminRoute({ child }: AdminRouteProps): JSX.Element {
    const user = authStore.getState().user;
    return user?.isAdmin ? child : <Navigate to="/" replace />;
}

export default AdminRoute;
