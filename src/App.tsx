import { useState } from 'react';
import './styles/index.css'
import { BrowserRouter as Router, Routes, Route, Link, useParams, Outlet, useOutletContext } from 'react-router-dom'
import ArticleList from './pages/Artcle/ArticleListNew.tsx'
import ArticleDetail from './pages/Artcle/ArticleDetail.tsx'
import ArticleForm from './pages/Artcle/ArticleForm.tsx'
import Login from './pages/Auth/Login.tsx'
import Register from './pages/Auth/Register.tsx'
import Profile from './pages/Profile/Profile.tsx'
import PrivateRoute from './components/PrivateRoute.tsx'
import TabBar from './components/TabBar.tsx'
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx'

// 编辑页面包装组件
const EditArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  return <ArticleForm isEdit articleId={id ? Number(id) : undefined} />;
};

// 带头部和底部的布局组件
const MainLayout = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="header-title">
            <h1>个人公众号</h1>
          </Link>
          <div className="header-right">
            <div className="search-box">
              <input 
                type="text" 
                className="search-input" 
                placeholder="搜索文章" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>
        </div>
      </header>
      <main className="main">
        <Outlet context={{ searchTerm }} />
      </main>
      <TabBar isAuthenticated={isAuthenticated} />
    </div>
  );
};

// 不带头部和底部的布局组件
const FormLayout = () => {
  return (
    <div className="app-full">
      <main className="main-full">
        <Outlet />
      </main>
    </div>
  );
};

// Profile页面布局组件
const ProfileLayout = () => {
  return (
    <div className="profile-layout">
      <Outlet />
      <TabBar isAuthenticated={true} />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 带头部和底部的路由 */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<ArticleListWrapper />} />
          </Route>
          
          {/* Profile页面路由 */}
          <Route element={<ProfileLayout />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          
          {/* 不带头部和底部的路由 */}
          <Route element={<FormLayout />}>
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route element={<PrivateRoute />}>
              <Route path="/create" element={<ArticleForm />} />
              <Route path="/edit/:id" element={<EditArticlePage />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

// 文章列表包装组件，用于接收搜索词
const ArticleListWrapper = () => {
  const { searchTerm } = useOutletContext<{ searchTerm: string }>();
  return <ArticleList searchTerm={searchTerm} />;
};

export default App