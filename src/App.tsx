import React from 'react';
import './App.css';
import {useUserStore} from "./store";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth Routes
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// User Routes
import Profile from "./components/user/Profile";
import EditProfile from "./components/user/EditProfile";
import PetitionsProfile from "./components/user/PetitionsProfile";

// Petition Routes
import Petitions from "./components/petitions/Petitions";
import DetailPetition from "./components/petitions/PetitionDetail";
import EditPetition from "./components/petitions/EditPetition";
import CreatePetition from "./components/petitions/CreatePetition";

// Other Routes
import Layout from "./components/layout/Layout";
import NotFound from "./components/NotFound";
import ChangePasswordProfile from "./components/user/ChangePasswordProfile";

function App() {

    // User information
    const userId = useUserStore((state) => state.userId);

    return (
        <Router>
            <Layout>
                <Routes>
                    {userId !== -1 ? (
                        <>
                            {/* Auth Routes */}
                            <Route path="/auth/login" element={<Navigate to="/user/profile" />} />
                            <Route path="/auth/register" element={<Navigate to="/user/profile" />} />

                            {/* User Routes */}
                            <Route path="/user/profile" element={<Profile />} />
                            <Route path="/user/profile/edit" element={<EditProfile />} />
                            <Route path="/user/profile/change-password" element={<ChangePasswordProfile/>} />
                            <Route path="/user/petitions" element={<PetitionsProfile />} />

                            {/* Petition Routes*/}
                            <Route path="/petitions/create" element={<CreatePetition />} />
                            <Route path="/petitions/:id/edit" element={<EditPetition />} />
                        </>
                    ) : (
                        <>
                            {/* Auth Routes */}
                            <Route path="/auth/login" element={<Login />} />
                            <Route path="/auth/register" element={<Register />} />

                            {/* User Routes */}
                            <Route path="/user/profile" element={<Navigate to="/auth/login" />} />
                            <Route path="/user/profile/edit" element={<Navigate to="/auth/login" />} />
                            <Route path="/user/profile/change-password" element={<Navigate to="/auth/login" />} />
                            <Route path="/user/petitions" element={<Navigate to="/auth/login" />} />

                            {/* Petition Routes*/}
                            <Route path="/petitions/:id/edit" element={<Navigate to="/auth/login" />} />
                            <Route path="/petitions/create" element={<Navigate to="/auth/login" />} />
                        </>
                    )}

                    {/* Public Routes */}
                    <Route path="/" element={<Navigate to="/petitions" />} />
                    <Route path="/petitions" element={<Petitions />} />
                    <Route path="/petitions/:id" element={<DetailPetition />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;