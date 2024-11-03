import MenuSidebar from "./components/MenuSidebar";
import Home from "./components/home";
import Login from './components/Login';
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Usuario from "./components/Usuario";
import Labs from "./components/Labs";

import Calendary from "./components/Calendary";
import Hours from "./components/Hours";


function App() {
  return (
      <Router>
        <Routes>
          <Route path ="/*" Component={Login}></Route>
          <Route element={<MenuSidebar />}>
            <Route path="/home" element={<Home />} />
            <Route path="/usuario" element={<Usuario />} />
            <Route path="/Calendario" element={<Calendary />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/hours" element={<Hours />} />
          </Route>
        </Routes>
      </Router>
  )
}


export default App;