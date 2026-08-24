import { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { authStore } from '../state/auth-state';

interface PrivateRouteProps {
    child: JSX.Element;
}

function PrivateRoute({ child }: PrivateRouteProps): JSX.Element {
    const user = authStore.getState().user;
    return user ? child : <Navigate to="/login" replace />;
}

export default PrivateRoute;
