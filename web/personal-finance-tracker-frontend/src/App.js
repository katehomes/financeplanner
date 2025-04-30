import './App.css';
import './css/navbar.css';
import { Routes, Route } from 'react-router-dom';
import About from './pages/About.tsx';
import Home from './pages/Home.tsx';
import Finance from './pages/Finance.tsx';
import NavBar from './components/NavBar.tsx';
import NoMatch from './components/NoMatch.js';

function App() {
  return (
    <>
      <NavBar />
      <div class="app-body">
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="*" element={<NoMatch />} />
          </Routes>
      </div>
      
    </>
 );
}

export default App;
