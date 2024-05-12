import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./components/NotFound";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Petitions from "./components/petitions/Petitions";

function App() {
  return (
      <div className="App">
        <Router>
          <div>
            <Routes>
              <Route path="/users/login" element={<Login />} />
              <Route path="/users/register" element={<Register />} />
              <Route path="/petitions" element={<Petitions />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </div>
  );
}

export default App;