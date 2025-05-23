declare namespace Auth {
  interface BasePayload {
    email: string;
    password: string;
  }

  export namespace User {    export interface RegisterPayload extends BasePayload {
      name: string;
    }

    export interface LoginPayload extends BasePayload {}

    export interface UserData {
      _id: string;
      email: string;
      name: string;
      userId: string;
      role: 'user';
    }

    export interface LoginResponse {
      token: string;
      user: UserData;
    }
  }

  export namespace Admin {
    export interface RegisterPayload extends BasePayload {
      name: string;
    }

    export interface LoginPayload extends BasePayload {}

    export interface UserData {
      _id: string;
      email: string;
      name: string;
      role: 'admin';
    }

    export interface LoginResponse {
      token: string;
      user: UserData;
    }
  }

  export interface ResetPasswordPayload {
    token: string;
    newPassword: string;
  }
}

export default Auth;
