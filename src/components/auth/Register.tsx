import * as React from 'react';
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
import {Alert, Snackbar} from "@mui/material";

const Register = () => {

    // Error flags
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    // Form values
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    // User information
    const setRegisterInfo = useUserStore((state) => state.setRegisterInfo);

    // Submits the register form
    const handleSubmit = () => {

        // Create request body
        const requestBody = {
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "password": password
        };

        // Send request
        axios.post('http://localhost:3000/api/v1/users/register', requestBody)
            .then((response) => {
                setRegisterInfo(response.data as UserRegister);
                console.log('Response:', response.data);
            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
    }

    // const [open, setOpen] = React.useState(false);
    //
    // const handleClose = () => {
    //     setOpen(false);
    // };
    //
    // const handleOpen = () => {
    //     setOpen(true);
    // };


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

                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>

                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>

                <Box sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="First Name"
                                autoComplete="given-name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}/>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Last Name"
                                autoComplete="family-name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}/>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Email Address"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}/>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Password"
                                type="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}/>
                        </Grid>
                    </Grid>

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                        onClick={() => handleSubmit()}>
                        Sign Up
                    </Button>

                    <Link href="#" variant="body2">
                        Already have an account? Sign in
                    </Link>
                </Box>

                {/*<Button onClick={handleOpen}>Show Toast</Button>*/}

                {/*<Snackbar*/}
                {/*    open={open}*/}
                {/*    autoHideDuration={6000}*/}
                {/*    onClose={handleClose}*/}
                {/*    message="Note archived"*/}
                {/*/>*/}
            </Box>
        </Container>
    );
}

export default Register;