import axios from 'axios';
import type {
  Article,
  CreateArticleDto,
  User,
  LoginDto,
  RegisterDto,
  LoginResponse
} from '../types/index';

// 创建axios实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 添加认证token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 统一错误处理
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// 文章API封装
export const articleApi = {
  getAll: (): Promise<Article[]> => {
    return api.get('/articles').then((response) => response.data);
  },
  getOne: (id: number): Promise<Article> => {
    return api.get(`/articles/${id}`).then((response) => response.data);
  },
  create: (article: CreateArticleDto): Promise<Article> => {
    return api.post('/articles', article).then((response) => response.data);
  },
  update: (id: number, article: Partial<CreateArticleDto>): Promise<Article> => {
    return api.put(`/articles/${id}`, article).then((response) => response.data);
  },
  incrementViews: (id: number): Promise<Article> => {
    return api.post(`/articles/${id}/views`).then((response) => response.data);
  },
  toggleLikes: (id: number, isLiked: boolean): Promise<Article> => {
    console.log('Calling toggleLikes with isLiked:', isLiked, 'type:', typeof isLiked);
    return api.post(`/articles/${id}/likes`, { isLiked }).then((response) => {
      console.log('toggleLikes response:', response.data);
      return response.data;
    });
  },
  toggleFavorites: (id: number, isFavorited: boolean): Promise<Article> => {
    console.log('Calling toggleFavorites with isFavorited:', isFavorited, 'type:', typeof isFavorited);
    return api.post(`/articles/${id}/favorites`, { isFavorited }).then((response) => {
      console.log('toggleFavorites response:', response.data);
      return response.data;
    });
  },
  delete: (id: number): Promise<void> => {
    return api.delete(`/articles/${id}`).then(() => {});
  },
};

// 认证API封装
export const authApi = {
  login: (credentials: LoginDto): Promise<LoginResponse> => {
    return api.post('/auth/login', credentials).then((response) => response.data);
  },
  register: (userData: RegisterDto): Promise<User> => {
    return api.post('/auth/register', userData).then((response) => response.data);
  },
  getCurrentUser: (): Promise<User> => {
    return api.get('/users/me').then((response) => response.data);
  },
  logout: (): Promise<void> => {
    return api.post('/auth/logout').then((response) => response.data);
  },
  updateUserInfo: (userData: Partial<User>): Promise<User> => {
    return api.put('/users/updateUserInfo', userData).then((response) => response.data);
  },
};
