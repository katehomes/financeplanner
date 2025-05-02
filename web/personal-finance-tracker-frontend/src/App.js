import './App.css';
import './css/sidebar.css';
import React, { useState } from "react";
import { Routes, Route } from 'react-router-dom';
import About from './pages/About';
import Home from './pages/Home';
import Finance from './pages/Finance';
import SideBar from './components/App/SideBar';
import NoMatch from './components/NoMatch';
import Categories from './pages/Categories';
import Tags from './pages/Tags';

const App = () => {

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
      <div className="app-container">
        <header className="app-header">
          <h1>PFA</h1>
        </header>
        <div className="app-body">
          <aside className={isSidebarOpen ? "app-sidebar active" : "app-sidebar"}>
            <SideBar isShown={isSidebarOpen} toggleSidebar={toggleSidebar}/>
          </aside>
          
          <main className="app-content">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/category" element={<Categories />} />
                <Route path="/tag" element={<Tags />} />
                <Route path="*" element={<NoMatch />} />
            </Routes>
          </main>
        </div>
      </div>
  );
};

export default App;