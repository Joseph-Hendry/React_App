import * as React from 'react';
import Box from '@mui/material/Box';
import axios from "axios";
import CSS from 'csstype';
import AppBar from './Appbar';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Avatar} from '@mui/material';
import {usePetitionStore} from "../../store";
import {ReactNode} from "react";


const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="App">
            <AppBar/>
            {children}
        </div>
    );
}

export default Layout;