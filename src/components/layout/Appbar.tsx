import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import {
    AppBar,
    Button,
    IconButton,
    Toolbar,
    Typography,
    Box,
    Menu,
    MenuItem, Avatar
} from "@mui/material";

const navItems = ['Home', 'About', 'Contact'];

const Appbar = () => {

    // Profile photo
    const [profileImageURL, setProfileImageURL] = React.useState("https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png");


    return (
        <AppBar position="sticky">
            <Toolbar>
                <Typography variant="h6" sx={{ display: 'block', marginRight: 5 }}>
                    Petition Site
                </Typography>

                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {navItems.map((item) => (
                        <Button key={item} sx={{ color: '#fff' }}>
                            {item}
                        </Button>
                    ))}
                </Box>

                {/* Spacer Box */}
                <Box sx={{ flexGrow: 1, display: 'block', marginRight: 5 }} />

                {/* Profile Photo */}
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Avatar
                        src={profileImageURL}
                        sx={{ width: 47, height: 47, marginRight: 1 }}
                    />
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Appbar;