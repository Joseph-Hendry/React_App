import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from "axios";
import {useUserStore} from "../../store";
import {Alert, IconButton, InputAdornment, Snackbar} from "@mui/material";
import {Visibility, VisibilityOff } from "@mui/icons-material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Global Variables
const validImageTypes = new Set(['image/jpeg', 'image/png', 'image/gif']);
const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

const Register = () => {

    // For navigation
    const navigate = useNavigate();

    // User information
    const setUserId = useUserStore((state) => state.setUserId);
    const setUserToken = useUserStore((state) => state.setUserToken);

    // Form values
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [userImg, setUserImg] = React.useState<File | null>(null);
    const [userImgURL, setUserImgURL] = React.useState<string>('https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png');

    // Valid flags
    const [firstNameValid, setFirstNameValid] = React.useState(false);
    const [lastNameValid, setLastNameValid] = React.useState(false);
    const [emailValid, setEmailValid] = React.useState(false);
    const [passwordValid, setPasswordValid] = React.useState(false);
    const [imgValid, setImgValid] = React.useState(true);

    // Error flags
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

    // Hides the password
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    // Handles uploading a profile picture
    const handleChangeImg = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Get file
        const file = event.target.files?.[0];

        // Check file and extension
        if (file && validImageTypes.has(file.type)) {
            setImgValid(true)
            setUserImg(file);
            setUserImgURL(URL.createObjectURL(file));
        } else {
            setImgValid(false)
        }
    };

    // Handle remove img
    const handleRemoveImg = () => {
        setImgValid(true);
        setUserImg(null)
        setUserImgURL('https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png');
    };

    const handleChangeFirstName = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Get and set value
        const temp = event.target.value;
        setFirstName(temp);

        // Check if valid
        if (temp.length > 0) {
            setFirstNameValid(true);
        } else {
            setFirstNameValid(false);
        }
    }

    const handleChangeLastName = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Get and set value
        const temp = event.target.value;
        setLastName(temp);

        // Check if valid
        if (temp.length > 0) {
            setLastNameValid(true);
        } else {
            setLastNameValid(false);
        }
    }

    const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        const temp = event.target.value;
        setEmail(temp);

        if (emailRegex.test(temp)) {
            setEmailValid(true);
        } else {
            setEmailValid(false);
        }
    }

    const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        const temp = event.target.value;
        setPassword(temp)

        if (temp.length >= 6) {
            setPasswordValid(true);
        } else {
            setPasswordValid(false);
        }
    }

    // Submits the register form
    const handleSubmit = async () => {
        // Create request body
        const requestBody = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
        };

        try {
            // Register the user
            await axios.post('http://localhost:3000/api/v1/users/register', requestBody);

            // Log the user in
            const loginResponse = await axios.post('http://localhost:3000/api/v1/users/login', {
                email: email,
                password: password,
            });

            // Get user variables
            const userId = loginResponse.data.userId;
            const userToken = loginResponse.data.token;

            // Set user variables
            setUserId(userId);
            setUserToken(userToken);

            // Upload profile photo if it exists
            if (userImg) {
                await axios.put(`http://localhost:3000/api/v1/users/${userId}/image`, userImg, {
                    headers: {
                        "X-Authorization": userToken,
                        "Content-Type": userImg.type
                    },
                });
            }

            // Navigate to profile page
            navigate('/user/profile');

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    showSnackbar(error.response.statusText);
                } else if (error.request) {
                    showSnackbar('No response received from the server.');
                } else {
                    showSnackbar('Error: ' + error.message);
                }
            } else {
                showSnackbar('An unexpected error occurred.');
            }
        }
    }

    const showSnackbar = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>

                {/* Sign Up Title */}
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>

                {/* Profile Photo */}
                <Avatar
                    src={userImgURL}
                    sx={{ width: 100, height: 100, mt: 2 }}
                />

                {/* Error Message */}
                {!imgValid && (
                    <Typography variant="body2" color="error" sx={{ mt: 1, textAlign: 'center' }}>
                        Please upload a valid profile image to sign up.
                    </Typography>
                )}

                {/* Register Form Grid */}
                <Box sx={{mt: 3}}>
                    <Grid container spacing={2}>

                        {/* Upload Button */}
                        <Grid item xs={6} mb={2}>
                            <Button
                                fullWidth
                                variant="outlined"
                                component="label"
                                startIcon={<CloudUploadIcon />}>
                                Upload
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleChangeImg}/>
                            </Button>
                        </Grid>

                        {/* Remove Button */}
                        <Grid item xs={6} mb={2}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="error"
                                component="label"
                                onClick={handleRemoveImg}>
                                Remove
                            </Button>
                        </Grid>

                        {/* First Name */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="First Name"
                                autoComplete="given-name"
                                value={firstName}
                                onChange={handleChangeFirstName}
                                error={!firstNameValid}
                                helperText={!firstNameValid ? 'First name is required.' : ''}/>
                        </Grid>

                        {/* Last Name */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                autoComplete="family-name"
                                value={lastName}
                                onChange={handleChangeLastName}
                                error={!lastNameValid}
                                helperText={!lastNameValid ? 'Last name is required.' : ''}/>
                        </Grid>

                        {/* Email Address */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                autoComplete="email"
                                value={email}
                                onChange={handleChangeEmail}
                                error={!emailValid}
                                helperText={!emailValid ? 'Please enter a valid email address.' : ''}/>
                        </Grid>

                        {/* Password */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                value={password}
                                onChange={handleChangePassword}
                                error={!passwordValid}
                                helperText={!passwordValid ? 'Password must be at least 6 characters.' : ''}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}/>
                        </Grid>

                        {/* Sign Up Button */}
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => handleSubmit()}>
                                Sign Up
                            </Button>
                        </Grid>

                        {/* Sign Up Button */}
                        <Grid item xs={12}>
                            <Link onClick={() => {navigate("/auth/login")}} variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            {/* Snackbar for error messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default Register;