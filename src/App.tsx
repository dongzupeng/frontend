import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, Outlet, useOutletContext } from 'react-router-dom'
import ArticleList from './pages/Artcle/ArticleList.tsx'
import ArticleDetail from './pages/Artcle/ArticleDetail.tsx'
import ArticleForm from './pages/Artcle/ArticleForm.tsx'
import Login from './pages/Auth/Login.tsx'
import Register from './pages/Auth/Register.tsx'
import Profile from './pages/Profile/Profile.tsx'
import ProfileEdit from './pages/Profile/ProfileEdit.tsx'
import UserArticles from './pages/Profile/UserArticles.tsx'
import UserFavorites from './pages/Profile/UserFavorites.tsx'
import UserLikes from './pages/Profile/UserLikes.tsx'
import UserHistory from './pages/Profile/UserHistory.tsx'
import FollowingPage from './pages/Following/Following.tsx'
import MessagesPage from './pages/Messages/Messages.tsx'
import PrivateRoute from './components/PrivateRoute.tsx'
import TabBar from './components/TabBar.tsx'
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx'
import { ToastManager } from './components/Toast.tsx'

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
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">鱼塘博客</h1>
            </Link>
          <div className="flex items-center">
            <div className="relative">
              <input 
                type="text" 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-600 bg-transparent placeholder-gray-400"
                placeholder="搜索文章" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-4xl px-4 py-6 flex-1">
        <Outlet context={{ searchTerm }} />
      </main>
      <TabBar isAuthenticated={isAuthenticated} />
    </div>
  );
};

// 不带头部和底部的布局组件
const FormLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

// Profile页面布局组件
const ProfileLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <TabBar isAuthenticated={true} />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastManager />
        <Routes>
          {/* 带头部和底部的路由 */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<ArticleListWrapper />} />
          </Route>
          
          {/* Profile页面路由 */}
          <Route element={<ProfileLayout />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/following" element={<FollowingPage />} />
            <Route path="/messages" element={<MessagesPage />} />
          </Route>
          
          {/* 不带头部和底部的路由 */}
          <Route element={<FormLayout />}>
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route element={<PrivateRoute />}>
              <Route path="/create" element={<ArticleForm />} />
              <Route path="/edit/:id" element={<EditArticlePage />} />
              <Route path="/profile/edit" element={<ProfileEdit />} />
              <Route path="/profile/articles" element={<UserArticles />} />
              <Route path="/profile/favorites" element={<UserFavorites />} />
              <Route path="/profile/likes" element={<UserLikes />} />
              <Route path="/profile/history" element={<UserHistory />} />
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