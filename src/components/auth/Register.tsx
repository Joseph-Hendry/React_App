import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from "axios";
import {useUserStore} from "../../store";
import {IconButton, InputAdornment} from "@mui/material";
import {Visibility, VisibilityOff } from "@mui/icons-material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const Register = () => {

    // For navigation
    const navigate = useNavigate();

    // Error flags
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    // Form values
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [profilePicture, setProfilePicture] = React.useState<File | null>(null);
    const [profilePictureURL, setProfilePictureURL] = React.useState<string | null>(null);

    // User information
    const setUserId = useUserStore((state) => state.setUserId);
    const setUserToken = useUserStore((state) => state.setUserToken);

    // Hides the password
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    // Handles uploading a profile picture
    const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setProfilePicture(file);
            setProfilePictureURL(URL.createObjectURL(file));
        }
    };

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
            if (profilePicture) {
                await axios.put(`http://localhost:3000/api/v1/users/${userId}/image`, profilePicture, {
                    headers: {
                        "X-Authorization": userToken,
                        "Content-Type": profilePicture.type
                    },
                });
            }

            // Navigate to profile page
            navigate('/users/profile');
        } catch (error) {
            setErrorFlag(true);
            setErrorMessage("There was an error :(");
        }
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

                {/* Icon */}
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>

                {/* Sign Up Title */}
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>

                {/* Register Form Grid */}
                <Box sx={{mt: 3}}>
                    <Grid container spacing={2}>

                        {/* First Name */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="First Name"
                                autoComplete="given-name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}/>
                        </Grid>

                        {/* Last Name */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Last Name"
                                autoComplete="family-name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}/>
                        </Grid>

                        {/* Email Address */}
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Email Address"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}/>
                        </Grid>

                        {/* Password */}
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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

                        {/* Sign Up Button */}
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => handleSubmit()}>
                                Sign Up
                            </Button>
                            {errorFlag && (
                                <Typography variant="body2" color="error">
                                    {errorMessage}
                                </Typography>
                            )}
                        </Grid>

                        {/* Sign Up Button */}
                        <Grid item xs={12}>
                            <Link onClick={() => {navigate("/users/login")}} variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}

export default Register;