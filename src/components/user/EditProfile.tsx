import * as React from 'react';
import axios from 'axios';
import { useUserStore } from '../../store';
import {
    Paper,
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
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const navigate = useNavigate();

    // User information
    const userId = useUserStore((state) => state.userId);
    const userToken = useUserStore((state) => state.userToken);
    const setUserId = useUserStore((state) => state.setUserId);
    // const setUserToken = useUserStore((state) => state.setUserToken);

    // Error flags
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    // Form variables
    const [user, setUser] = React.useState<User | null>(null);
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);

    // Profile photo
    const [profileImageURL, setProfileImageURL] = React.useState(
        'https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png'
    );
    const [profilePicture, setProfilePicture] = React.useState<File | null>(null);

    // Get user's current information
    React.useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/v1/users/${userId}`, {
                    headers: { 'X-Authorization': userToken },
                });
                setUser(response.data);
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setEmail(response.data.email);
                setErrorFlag(false);
                setErrorMessage('');
            } catch (error) {
                setErrorFlag(true);
                // setErrorMessage(error.toString());
            }
        };
        getUser();
    }, [userId, userToken]);

    // Get user's profile image
    React.useEffect(() => {
        const getProfileImage = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/v1/users/${userId}/image`, {
                    responseType: 'blob',
                });
                setProfileImageURL(URL.createObjectURL(response.data));
                setErrorFlag(false);
                setErrorMessage('');
            } catch (error) {
                setErrorFlag(true);
                // setErrorMessage(error.toString());
            }
        };
        getProfileImage();
    }, [userId]);

    // Handle profile picture change
    const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setProfilePicture(event.target.files[0]);
            setProfileImageURL(URL.createObjectURL(event.target.files[0]));
        }
    };

    // Handle show/hide password
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    // Handle form submission
    const handleSubmit = async () => {
        try {
            const updateRequestBody = {
                firstName,
                lastName,
                email,
                ...(password && { password }), // Include password only if it's not empty
            };

            // Update user details
            await axios.patch(`http://localhost:3000/api/v1/users/${userId}`, updateRequestBody, {
                headers: { 'X-Authorization': userToken },
            });

            // Upload profile photo if selected
            if (profilePicture) {

                await axios.put(`http://localhost:3000/api/v1/users/${userId}/image`, profilePicture, {
                    headers: {
                        'X-Authorization': userToken,
                        'Content-Type': profilePicture.type,
                    },
                });

                // For running Appbar hook
                setUserId(userId);
            }

            // Navigate to profile page
            navigate('/users/profile');
        } catch (error) {
            setErrorFlag(true);
            // setErrorMessage(error.toString());
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
                }}
            >
                <Avatar src={profileImageURL} sx={{ width: 100, height: 100 }} />

                <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
                    Edit Profile
                </Typography>

                <Box sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="First Name"
                                autoComplete="given-name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Last Name"
                                autoComplete="family-name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Email Address"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                <Avatar src={profileImageURL} sx={{ width: 56, height: 56, mr: 2 }} />
                                <Button variant="contained" component="label">
                                    Upload Profile Picture
                                    <input type="file" hidden onChange={handleProfilePictureChange} />
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>

                    <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleSubmit}>
                        Save Changes
                    </Button>
                    {errorFlag && (
                        <Typography variant="body2" color="error">
                            {errorMessage}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default EditProfile;