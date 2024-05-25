import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserStore } from '../../store';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
    Typography,
    Avatar,
    TextField,
    Button,
    Container,
    CssBaseline,
    Box,
    Grid, Snackbar, Alert,
} from '@mui/material';

const validImageTypes = new Set(['image/jpeg', 'image/png', 'image/gif']);
const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

const EditProfile = () => {

    // For navigation
    const navigate = useNavigate();

    // User information
    const userId = useUserStore((state) => state.userId);
    const userToken = useUserStore((state) => state.userToken);
    const userChangeFlag = useUserStore((state) => state.userChangeFlag);
    const setUserChangeFlag = useUserStore((state) => state.setUserChangeFlag);

    // Form variables
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');

    // Valid flags
    const [firstNameValid, setFirstNameValid] = React.useState(true);
    const [lastNameValid, setLastNameValid] = React.useState(true);
    const [emailValid, setEmailValid] = React.useState(true);
    const [imgValid, setImgValid] = React.useState(true);

    // Profile photo
    const [userImg, setUserImg] = React.useState<File | null>(null);
    const [userImgURL, setUserImgURL] = React.useState('https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png');
    const [userImgRemoved, setUserImgRemoved] = React.useState(false);

    // Error flags
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

    // Get user information
    React.useEffect(() => {
        const getUser = async () => {
            try {
                // Send request
                const response = await axios.get(`http://localhost:3000/api/v1/users/${userId}`, {
                    headers: { 'X-Authorization': userToken },
                });

                // Set variables
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setEmail(response.data.email);

            } catch (error) {}
        };
        getUser();
    }, [userId, userToken]);

    // Get user image
    React.useEffect(() => {
        const getUserImg = () => {
            axios.get(`http://localhost:3000/api/v1/users/${userId}/image`, { responseType: "blob" })
                .then((response) => {
                    setUserImgURL(URL.createObjectURL(response.data));
                }, (error) => {});
        };
        getUserImg();
    }, [userId, userToken, userChangeFlag]);

    // Handle profile picture change
    const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Get file
        const file = event.target.files?.[0];

        // Check file and extension
        if (file && validImageTypes.has(file.type)) {
            setImgValid(true)
            setUserImgRemoved(false);
            setUserImg(file);
            setUserImgURL(URL.createObjectURL(file));
        } else {
            setImgValid(false)
        }
    };

    // Handle remove profile picture
    const handleRemove = () => {
        if (userImgURL !== 'https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png') {
            setUserImgRemoved(true);
            setUserImg(null);
            setUserImgURL('https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png');
        }
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

    // Handle cancel
    const handleCancel = () => {
        navigate("/user/profile");
    }

    // Handle save
    const handleSave = async () => {
        try {

            // Make request body
            const updateRequestBody = {
                firstName,
                lastName,
                email,
            };

            // Update user details
            await axios.patch(`http://localhost:3000/api/v1/users/${userId}`, updateRequestBody, {
                headers: { 'X-Authorization': userToken },
            });

            // Upload profile photo if selected
            if (userImg) {
                await axios.put(`http://localhost:3000/api/v1/users/${userId}/image`, userImg, {
                    headers: {
                        'X-Authorization': userToken,
                        'Content-Type': userImg.type,
                    },
                });
                setUserImgURL(userImgURL);

            // Delete photo if removed
            } else if (userImgRemoved) {
                await axios.delete(`http://localhost:3000/api/v1/users/${userId}/image`, {
                    headers: {
                        'X-Authorization': userToken
                    }
                });
                setUserImgURL('');
            }

            // Update user
            setUserChangeFlag(userChangeFlag + 1);

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
    };

    const showSnackbar = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
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

                {/* Edit Profile Title */}
                <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
                    Edit Profile
                </Typography>

                {/* Profile Photo */}
                <Avatar
                    src={userImgURL}
                    sx={{ width: 100, height: 100, mt:2 }}/>

                {/* Error Message */}
                {!imgValid && (
                    <Typography variant="body2" color="error" sx={{ mt: 1, textAlign: 'center' }}>
                        Please upload a valid profile image to sign up.
                    </Typography>
                )}

                {/* Form Grid */}
                <Box sx={{ mt: 3 }}>
                    <Grid container spacing={2} alignItems="baseline">

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
                                    onChange={handleProfilePictureChange}/>
                            </Button>
                        </Grid>

                        {/* Remove Button */}
                        <Grid item xs={6} mb={2}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="error"
                                component="label"
                                onClick={handleRemove}>
                                Remove
                            </Button>
                        </Grid>

                        {/* First Name */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
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
                                required
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
                                required
                                fullWidth
                                label="Email Address"
                                autoComplete="email"
                                value={email}
                                onChange={handleChangeEmail}
                                error={!emailValid}
                                helperText={!emailValid ? 'Please enter a valid email address.' : ''}/>
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
};

export default EditProfile;