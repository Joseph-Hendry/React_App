import React from "react";
import { useNavigate } from 'react-router-dom';
import {useUserStore} from "../../store";
import {
    AppBar,
    Button,
    IconButton,
    Toolbar,
    Typography,
    Box,
    Menu,
    MenuItem, Avatar, Tooltip
} from "@mui/material";
import axios from "axios";

const Appbar = () => {

    // For navigation
    const navigate = useNavigate();

    // User information
    const userId = useUserStore((state) => state.userId);
    const userToken = useUserStore((state) => state.userToken);
    const userChangeFlag = useUserStore((state) => state.userChangeFlag);
    const setUserId = useUserStore((state) => state.setUserId);
    const setUserToken = useUserStore((state) => state.setUserToken);

    // User image
    const [userImgURL, setUserImgURL] = React.useState('https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png');

    // Menu Items
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    // Error flags
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    // Get user image
    React.useEffect(() => {
        const getUserImg = () => {
            axios.get(`http://localhost:3000/api/v1/users/${userId}/image`, { responseType: "blob" })
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setUserImgURL(URL.createObjectURL(response.data));
                }, (error) => {
                    setUserImgURL('https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png');
                });
        };
        getUserImg();
    }, [userId, userToken, userChangeFlag]);

    // Handles petitions button
    const handlePetitions = () => {
        navigate('/petitions');
    };

    // Handles opening menu
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    // Handles closing menu
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    // Handles profile button
    const handleProfile = () => {
        setAnchorElUser(null);
        navigate('/user/profile');
    };

    // Handles logout button
    const handleLogout = () => {
        setAnchorElUser(null);
        setUserId(-1);
        setUserToken(null);
        navigate('/auth/login');
    };

    // Handles logout button
    const handleMyPetitions = () => {
        setAnchorElUser(null);
        navigate('/user/petitions');
    };

    // Handles login button
    const handleLogin = () => {
        navigate('/auth/login');
    };

    return (
        <AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>

                {/* Title */}
                <Typography onClick={handlePetitions} variant="h6" sx={{ display: 'block', marginRight: 5 }}>
                    Petition Site
                </Typography>

                {/* Spacer Box */}
                <Box sx={{ flexGrow: 1, display: 'block', marginRight: 5 }} />

                {/* Profile Photo */}
                {userToken && (
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>

                        {/* Profile Photo */}
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar src={userImgURL}
                                        sx={{ width: 47, height: 47, marginRight: 1 }}/>
                            </IconButton>
                        </Tooltip>

                        {/* Profile Settings */}
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}>

                            {/* Profile */}
                            <MenuItem onClick={handleProfile}>
                                <Typography textAlign="center">Profile</Typography>
                            </MenuItem>

                            {/* My Petitions */}
                            <MenuItem onClick={handleMyPetitions}>
                                <Typography textAlign="center">My Petitions</Typography>
                            </MenuItem>

                            {/* Logout */}
                            <MenuItem onClick={handleLogout}>
                                <Typography textAlign="center">Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                )}

                {/* Login Button */}
                {!userToken && (
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Button color="inherit" onClick={handleLogin}>Login</Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Appbar;