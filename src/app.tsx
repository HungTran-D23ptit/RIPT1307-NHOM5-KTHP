import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { notification } from 'antd';
import 'moment/locale/vi';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { getIntl, getLocale, history } from 'umi';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import ErrorBoundary from './components/ErrorBoundary';
// import LoadingPage from './components/Loading';
import { OIDCBounder } from './components/OIDCBounder';
import { unCheckPermissionPaths } from './components/OIDCBounder/constant';
import OneSignalBounder from './components/OneSignalBounder';
import TechnicalSupportBounder from './components/TechnicalSupportBounder';
import NotAccessible from './pages/exception/403';
import NotFoundContent from './pages/exception/404';
import type { IInitialState } from './services/base/typing';
import './styles/global.less';

/**  loading */
export const initialStateConfig = {
	loading: <></>,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * // Tobe removed
 * */
export async function getInitialState(): Promise<IInitialState> {
	return {
		permissionLoading: true,
	};
}

// Tobe removed
const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => ({});

/**
 * @see https://beta-pro.ant.design/docs/request-cn
 */
export const request: RequestConfig = {
	errorHandler: (error: ResponseError) => {
		const { messages } = getIntl(getLocale());
		const { response } = error;

		if (response && response.status) {
			const { status, statusText, url } = response;
			const requestErrorMessage = messages['app.request.error'];
			const errorMessage = `${requestErrorMessage} ${status}: ${url}`;
			const errorDescription = messages[`app.request.${status}`] || statusText;
			notification.error({
				message: errorMessage,
				description: errorDescription,
			});
		}

		if (!response) {
			notification.error({
				description: 'Yêu cầu gặp lỗi',
				message: 'Bạn hãy thử lại sau',
			});
		}
		throw error;
	},
	requestInterceptors: [authHeaderInterceptor],
};

// Function to check if user has access to a route
const hasRouteAccess = (pathname: string, role: string | null): boolean => {
	// Public routes
	if (pathname.includes('/auth') || pathname === '/landing' || pathname === '/') {
		return true;
	}

	// No role means no access to protected routes
	if (!role) {
		return false;
	}

	// Admin access
	if (role === 'admin') {
		// Admin can access admin routes and common dashboard
		return pathname.startsWith('/admin') || pathname === '/dashboard';
	}

	// User access
	if (role === 'user') {
		// User can access user routes and common dashboard
		return pathname.startsWith('/user') || pathname === '/dashboard';
	}

	return false;
};

// Function to get default route for role
const getDefaultRouteForRole = (role: string | null): string => {
	if (role === 'admin') {
		return '/admin/dashboard';
	}
	if (role === 'user') {
		return '/user/dashboard';
	}
	return '/landing';
};

// Utility function to get current user role
const getCurrentUserRole = () => {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('role');
	}
	return null;
};

// Function to filter menu items based on user role
const filterMenuByRole = (menuData: any[], role: string | null): any[] => {
	if (!role) return [];

	return menuData.filter((item) => {
		// Skip auth routes and landing page
		if (item.path?.includes('/auth') || item.path === '/landing') {
			return false;
		}

		// Common dashboard is accessible to both roles
		if (item.path === '/dashboard') {
			return true;
		}

		// Admin role access
		if (role === 'admin') {
			return item.path?.startsWith('/admin');
		}

		// User role access
		if (role === 'user') {
			return item.path?.startsWith('/user');
		}

		return false;
	});
};

// ProLayout  https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
	return {
		unAccessible: (
			<OIDCBounder>
				<TechnicalSupportBounder>
					<NotAccessible />
				</TechnicalSupportBounder>
			</OIDCBounder>
		),
		noFound: <NotFoundContent />,
		rightContentRender: () => <RightContent />,
		disableContentMargin: false,

		footerRender: () => <Footer />,

		// Filter menu items based on user role
		menuDataRender: (menuData) => {
			const userRole = getCurrentUserRole();
			return filterMenuByRole(menuData, userRole);
		},

		onPageChange: () => {
			const { location } = history;
			const currentRole = getCurrentUserRole();
			const isUncheckPath = unCheckPermissionPaths.some((path) => window.location.pathname.includes(path));

			// Handle root path redirect
			if (location.pathname === '/') {
				if (currentRole) {
					history.replace(getDefaultRouteForRole(currentRole));
				} else {
					history.replace('/landing');
				}
				return;
			}

			// Check route access based on role
			if (!isUncheckPath && !hasRouteAccess(location.pathname, currentRole)) {
				if (!currentRole) {
					// Not logged in, redirect to login
					history.replace('/auth/login');
				} else {
					// Logged in but no access, redirect to 403
					history.replace('/403');
				}
				return;
			}

			// Original permission checking logic
			if (initialState?.currentUser) {
				if (
					!isUncheckPath &&
					currentRole &&
					initialState?.authorizedPermissions?.length &&
					!initialState?.authorizedPermissions?.find((item) => item.rsname === currentRole)
				) {
					history.replace('/403');
				}
			}
		},

		menuItemRender: (item: any, dom: any) => (
			<a
				className='not-underline'
				key={item?.path}
				href={item?.path}
				onClick={(e) => {
					e.preventDefault();
					history.push(item?.path ?? '/');
				}}
				style={{ display: 'block' }}
			>
				{dom}
			</a>
		),

		childrenRender: (dom) => (
			<OIDCBounder>
				<ErrorBoundary>
					{/* <TechnicalSupportBounder> */}
					<OneSignalBounder>{dom}</OneSignalBounder>
					{/* </TechnicalSupportBounder> */}
				</ErrorBoundary>
			</OIDCBounder>
		),
		menuHeaderRender: undefined,
		...initialState?.settings,
	};
};
