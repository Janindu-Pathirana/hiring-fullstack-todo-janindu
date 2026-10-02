export interface IRegisterRequestBody {
  username: string;
  password: string;
}

export interface ILoginRequestBody {
  username: string;
  password: string;
}

export interface IRefreshRequestBody {
  refreshToken: string;
}

export interface ILogoutRequestBody {
  refreshToken: string;
}
