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
    Grid,
} from '@mui/material';

const EditProfile = () => {

    // For navigation
    const navigate = useNavigate();

    // User information
    const userId = useUserStore((state) => state.userId);
    const userToken = useUserStore((state) => state.userToken);
    const userImgURL = useUserStore((state) => state.userImgURL);
    const setUserImgURL = useUserStore((state) => state.setUserImgURL);

    // Form variables
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');

    // Profile photo
    const [profilePicture, setProfilePicture] = React.useState<File | null>(null);
    const [profilePictureURL, setProfilePictureURL] = React.useState(userImgURL);
    const [profilePictureRemoved, setProfilePictureRemoved] = React.useState(false);

    // Error flags
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    // Get user's current information
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
                setErrorFlag(false);
                setErrorMessage('');

            } catch (error) {
                setErrorFlag(true);
            }
        };
        getUser();
    }, [userId, userToken]);

    // Handle profile picture change
    const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Add file if valid
        if (event.target.files && event.target.files[0]) {
            // Set not removed
            setProfilePictureRemoved(false);

            // Set File
            setProfilePicture(event.target.files[0]);
            setProfilePictureURL(URL.createObjectURL(event.target.files[0]));
        }
    };

    // Handle remove profile picture
    const handleRemove = () => {
        if (userImgURL !== 'https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png')
            setProfilePictureRemoved(true);
            setProfilePicture(null)
            setProfilePictureURL('https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png');
    };

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
            if (profilePicture) {
                await axios.put(`http://localhost:3000/api/v1/users/${userId}/image`, profilePicture, {
                    headers: {
                        'X-Authorization': userToken,
                        'Content-Type': profilePicture.type,
                    },
                });
                setUserImgURL(profilePictureURL);

            // Delete photo if removed
            } else if (profilePictureRemoved) {
                await axios.delete(`http://localhost:3000/api/v1/users/${userId}/image`, {
                    headers: {
                        'X-Authorization': userToken
                    }
                });
                setUserImgURL('');
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
                }}>

                {/* Edit Profile Title */}
                <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
                    Edit Profile
                </Typography>

                {/* Profile Photo */}
                <Avatar
                    src={profilePictureURL}
                    sx={{ width: 100, height: 100, mt:2 }}/>

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

                    {/* Error Flag */}
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