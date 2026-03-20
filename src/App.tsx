import { useState } from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link, useParams, Outlet, useOutletContext } from 'react-router-dom'
import ArticleList from './pages/Artcle/ArticleListNew.tsx'
import ArticleDetail from './pages/Artcle/ArticleDetail.tsx'
import ArticleForm from './pages/Artcle/ArticleForm.tsx'

// 编辑页面包装组件
const EditArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  return <ArticleForm isEdit articleId={id ? Number(id) : undefined} />;
};

// 带头部和底部的布局组件
const MainLayout = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  
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
            <div className="menu-icon">☰</div>
          </div>
        </div>
      </header>
      <main className="main">
        <Outlet context={{ searchTerm }} />
      </main>
      <footer className="footer">
        <div className="footer-content">
          <p>© 2026 个人公众号</p>
        </div>
      </footer>
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

function App() {
  return (
    <Router>
      <Routes>
        {/* 带头部和底部的路由 */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<ArticleListWrapper />} />
        </Route>
        
        {/* 不带头部和底部的路由 */}
        <Route element={<FormLayout />}>
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/create" element={<ArticleForm />} />
          <Route path="/edit/:id" element={<EditArticlePage />} />
        </Route>
      </Routes>
    </Router>
  )
}

// 文章列表包装组件，用于接收搜索词
const ArticleListWrapper = () => {
  const { searchTerm } = useOutletContext<{ searchTerm: string }>();
  return <ArticleList searchTerm={searchTerm} />;
};

export default App