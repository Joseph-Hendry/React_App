import * as React from 'react';
import AppBar from './Appbar';
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