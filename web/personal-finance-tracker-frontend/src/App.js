import './App.css';
import './css/navbar.css';
import { Routes, Route } from 'react-router-dom';
import About from './pages/About.tsx';
import Home from './pages/Home.tsx';
import Todo from './pages/Todo.tsx';
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
              <Route path="/about" element={<Todo />} />
              <Route path="*" element={<NoMatch />} />
          </Routes>
      </div>
      
    </>
 );
}

export default App;
