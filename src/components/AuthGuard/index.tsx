import React, { useEffect } from 'react';
import { history } from 'umi';
import { Spin } from 'antd';

interface AuthGuardProps {
	children: React.ReactNode;
	requiredRole?: 'admin' | 'user';
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
	const [loading, setLoading] = React.useState(true);
	const [hasAccess, setHasAccess] = React.useState(false);

	useEffect(() => {
		const checkAuth = () => {
			const token = localStorage.getItem('token');
			const userRole = localStorage.getItem('role');

			// Check if user is logged in
			if (!token || !userRole) {
				history.push('/auth/login');
				return;
			}

			// Check role-based access
			if (requiredRole && userRole !== requiredRole) {
				// Redirect to appropriate dashboard if wrong role
				if (userRole === 'admin') {
					history.push('/admin/dashboard');
				} else {
					history.push('/user/dashboard');
				}
				return;
			}

			setHasAccess(true);
			setLoading(false);
		};

		checkAuth();
	}, [requiredRole]);

	if (loading) {
		return (
			<div style={{ 
				display: 'flex', 
				justifyContent: 'center', 
				alignItems: 'center', 
				height: '100vh' 
			}}>
				<Spin size="large" />
			</div>
		);
	}

	if (!hasAccess) {
		return null;
	}

	return <>{children}</>;
};

export default AuthGuard;
