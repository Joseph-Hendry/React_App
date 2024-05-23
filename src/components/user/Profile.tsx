import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useUserStore } from "../../store";
import {
    Typography,
    Avatar,
    Button,
    Box, CssBaseline, Grid, TextField, Container
} from '@mui/material';

const Profile = () => {

    // For navigation
    const navigate = useNavigate();

    // User information
    const userId = useUserStore((state) => state.userId);
    const userToken = useUserStore((state) => state.userToken);
    const userImgURL = useUserStore((state) => state.userImgURL);

    // Form Variables
    const [user, setUser] = React.useState<User | null>()

    // Error flags
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    // Get user information
    React.useEffect(() => {
        const getUser = () => {
            axios.get('http://localhost:3000/api/v1/users/' + userId, { headers: { "X-Authorization": userToken }})
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setUser(response.data);
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };

        getUser();
    }, [userId, userToken]);

    return (
        <>
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>

                {/* Edit Profile Title */}
                <Typography component="h1" variant="h5" sx={{mt: 2}}>
                    Profile
                </Typography>

                {/* Profile Photo */}
                <Avatar
                    src={userImgURL}
                    sx={{width: 100, height: 100, mt: 2}}/>

                {/* Form Grid */}
                <Box sx={{mt: 3}}>
                    <Grid container spacing={2} alignItems="baseline">

                        {/* First Name */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                disabled
                                value={user?.firstName || ""}/>
                        </Grid>

                        {/* Last Name */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                disabled
                                value={user?.lastName || ""}/>
                        </Grid>

                        {/* Email Address */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                disabled
                                value={user?.email || ""}/>
                        </Grid>

                        {/* Cancel Button */}
                        <Grid item xs={12} sm={6} mt={1}>
                            <Button
                                variant="outlined"
                                onClick={() => {navigate("/user/profile/edit");}}>
                                Edit Profile
                            </Button>
                        </Grid>

                        {/* Save Button */}
                        <Grid item xs={12} sm={6} mt={1}>
                            <Button
                                variant="outlined"
                                onClick={() => {navigate("/user/profile/change-password");}}>
                                Change Password
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
        </>
    );
};

export default Profile;
