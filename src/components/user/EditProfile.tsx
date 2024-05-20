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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const EditProfile = () => {

    // For navigation
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
    const [currentPassword, setCurrentPassword] = React.useState('');
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showOldPassword, setShowOldPassword] = React.useState(false);

    // Profile photo
    const [profilePictureURL, setProfilePictureURL] = React.useState(
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
                setProfilePictureURL(URL.createObjectURL(response.data));
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
            setProfilePictureURL(URL.createObjectURL(event.target.files[0]));
        }
    };

    // Handle show/hide password
    const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
    const handleClickShowOldPassword = () => setShowOldPassword((show) => !show);

    // Handle form submission
    const handleSubmit = async () => {
        try {
            const updateRequestBody = {
                firstName,
                lastName,
                email,
                ...((password || currentPassword) && { password, currentPassword }),
            };

            console.log("Update Request Body:", JSON.stringify(updateRequestBody, null, 2));

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
            navigate('/user/profile');
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
                <Avatar src={profilePictureURL} sx={{ width: 100, height: 100 }} />

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

                        {/* Upload Profile Photo */}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>

                                {/* Profile Photo */}
                                <Avatar
                                    src={profilePictureURL || ""}
                                    sx={{ width: 45, height: 45, mr: 2 }}/>

                                {/* Upload Profile Photo */}
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    component="label"
                                    startIcon={<CloudUploadIcon />}>
                                    Upload Profile Picture
                                    <input
                                        type="file"
                                        hidden
                                        onChange={handleProfilePictureChange}/>
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>

                    <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleSubmit}>
                        Save Changes
                    </Button>
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

export default EditProfile;