// 定义用户类型
export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// 定义登录请求类型
export interface LoginDto {
  username: string;
  password: string;
}

// 定义注册请求类型
export interface RegisterDto {
  username: string;
  password: string;
  email: string;
}

// 定义登录响应类型
export interface LoginResponse {
  access_token: string;
  user: User;
}
