import { useState } from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom'
import ArticleList from './pages/Artcle/ArticleListNew.tsx'
import ArticleDetail from './pages/Artcle/ArticleDetail.tsx'
import ArticleForm from './pages/Artcle/ArticleForm.tsx'

// 编辑页面包装组件
const EditArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  return <ArticleForm isEdit articleId={id ? Number(id) : undefined} />;
};

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');

  return (
    <Router>
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
          <Routes>
            <Route path="/" element={<ArticleList searchTerm={searchTerm} />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/create" element={<ArticleForm />} />
            <Route path="/edit/:id" element={<EditArticlePage />} />
          </Routes>
        </main>
        <footer className="footer">
          <div className="footer-content">
            <p>© 2026 个人公众号</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App