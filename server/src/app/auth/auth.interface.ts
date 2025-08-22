export interface SigninData {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  username: string;
  password: string;
  shopNames: string[];
}
