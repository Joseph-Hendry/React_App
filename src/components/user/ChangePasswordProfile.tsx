import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserStore } from '../../store';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
    Typography,
    Avatar,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    Container,
    CssBaseline,
    Box,
    Grid,
} from '@mui/material';

const ChangePasswordProfile = () => {

    // For navigation
    const navigate = useNavigate();

    // User information
    const userId = useUserStore((state) => state.userId);
    const userToken = useUserStore((state) => state.userToken);

    // Error flags
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    // Form variables
    const [password, setPassword] = React.useState('');
    const [currentPassword, setCurrentPassword] = React.useState('');
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showOldPassword, setShowOldPassword] = React.useState(false);


    // Handle show/hide password
    const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
    const handleClickShowOldPassword = () => setShowOldPassword((show) => !show);

    // Handle cancel
    const handleCancel = () => {
        navigate("/user/profile");
    }

    // Handle save
    const handleSave = async () => {
        try {

            // Make request body
            const updateRequestBody = {
                password,
                currentPassword,
            };

            // Update user details
            await axios.patch(`http://localhost:3000/api/v1/users/${userId}`, updateRequestBody, {
                headers: { 'X-Authorization': userToken },
            });

            // Navigate to profile page
            navigate('/user/profile');

        } catch (error) {
            setErrorFlag(true);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>

                {/* Icon */}
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>

                <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
                    Change Password
                </Typography>

                <Box sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="New Password"
                                type={showNewPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowNewPassword}
                                                edge="end"
                                            >
                                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Old Password"
                                type={showOldPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowOldPassword}
                                                edge="end"
                                            >
                                                {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        {/* Cancel Button */}
                        <Grid item xs={12} sm={6} mt={1}>
                            <Button fullWidth variant="outlined" onClick={handleCancel}>
                                cancel
                            </Button>
                        </Grid>

                        {/* Save Button */}
                        <Grid item xs={12} sm={6} mt={1}>
                            <Button fullWidth variant="contained" onClick={handleSave}>
                                Save
                            </Button>
                        </Grid>

                    </Grid>

                    {errorFlag && (
                        <Typography variant="body2" color="error">
                            There's an error :(
                        </Typography>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default ChangePasswordProfile;