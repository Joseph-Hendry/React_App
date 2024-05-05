import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Users from "./components/user/Users";
import User from "./components/user/User";
import NotFound from "./components/NotFound";
import UserList from "./components/UserList";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

function App() {
  return (
      <div className="App">
        <Router>
          <div>
            <Routes>
              <Route path="/users/login" element={<Login />} />
              <Route path="/users/register" element={<Register />} />
              <Route path="/users/:id" element={<User />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </div>
  );
}

export default App;