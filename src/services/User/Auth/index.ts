import rootAPI from '../../rootAPI';
import {
  LoginCredentials,
  RegisterCredentials,
  GoogleLoginCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from './typing';

export async function loginUser(credentials: LoginCredentials) {
  return rootAPI.post('/user/auth/login', credentials);
}

export async function registerUser(credentials: RegisterCredentials) {
  return rootAPI.post('/user/auth/register', credentials);
}

export async function loginWithGoogle(credentials: GoogleLoginCredentials) {
  return rootAPI.post('/user/auth/login/google', credentials);
}

export async function changePassword(request: ChangePasswordRequest) {
  return rootAPI.put('/user/auth/change-password', request);
}

export async function forgotPassword(request: ForgotPasswordRequest) {
  return rootAPI.post('/user/auth/forgot-password', request);
}

export async function resetPassword(request: ResetPasswordRequest) {
  return rootAPI.post('/user/auth/reset-password', request);
}

export async function getMeUser() {
  return rootAPI.get('/user/auth/me');
}

export async function logoutUser() {
  return rootAPI.post('/user/auth/logout');
}
