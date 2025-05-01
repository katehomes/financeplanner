import './App.css';
import './css/navbar.css';
import { Routes, Route } from 'react-router-dom';
import About from './pages/About';
import Home from './pages/Home';
import Finance from './pages/Finance';
import NavBar from './components/NavBar';
import NoMatch from './components/NoMatch';
import Categories from './pages/Categories';
import Tags from './pages/Tags';

function App() {
  return (
    <>
      <NavBar />
      <div class="app-body">
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/category" element={<Categories />} />
              <Route path="/tag" element={<Tags />} />
              <Route path="*" element={<NoMatch />} />
          </Routes>
      </div>
      
    </>
 );
}

export default App;
