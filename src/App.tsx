import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./components/NotFound";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PetitionsPaper from "./components/petitions/PetitionsPaper";
import Petitions from "./components/petitions/Petitions";
import {AppBar, Button, IconButton, Toolbar, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Layout from "./components/layout/Layout";

function App() {
  return (
      <Router>
          <Layout>
              <Routes>
                  <Route path="/users/login" element={<Login />} />
                  <Route path="/users/register" element={<Register />} />
                  <Route path="/petitions" element={<PetitionsPaper />} />
                  <Route path="*" element={<NotFound />} />
              </Routes>
          </Layout>
      </Router>
  );
}

export default App;