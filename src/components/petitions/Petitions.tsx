import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import {
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    IconButton,
    Box,
    Button,
    List,
    ListItem,
    ListItemText} from '@mui/material';

const Petitions = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Toolbar />
                <List>
                    <ListItem button>
                        <ListItemText primary="Search Condition 1" />
                    </ListItem>
                    <ListItem button>
                        <ListItemText primary="Search Condition 2" />
                    </ListItem>
                    {/* Add more search conditions as needed */}
                </List>
            </Drawer>

            {/* Main Content */}
            <div style={{ flexGrow: 1, padding: '20px' }}>
                {/* Your main content goes here */}
                <Typography variant="h4" gutterBottom>
                    Welcome to Your App
                </Typography>
                <Typography variant="body1">
                    This is your main content area where you can display your app's content.
                </Typography>
            </div>
        </Box>
    );
};

export default Petitions;
