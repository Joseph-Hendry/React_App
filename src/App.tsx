import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./components/NotFound";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Petitions from "./components/petitions/Petitions";
import PetitionDetail from "./components/petitions/PetitionDetail";
import Layout from "./components/layout/Layout";

function App() {
  return (
      <Router>
          <Layout>
              <Routes>
                  <Route path="/users/login" element={<Login />} />
                  <Route path="/users/register" element={<Register />} />
                  <Route path="/petitions" element={<Petitions />} />
                  <Route path="/petitions/:id" element={<PetitionDetail />} />
                  <Route path="*" element={<NotFound />} />
              </Routes>
          </Layout>
      </Router>
  );
}

export default App;