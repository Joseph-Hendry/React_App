import * as React from 'react';
import axios from "axios";
import {useUserStore} from "../../store";
import {
    Paper,
    Typography,
    Pagination
} from '@mui/material';

const Profile = () => {

    // User information
    const userId = useUserStore((state) => state.userId);
    const userToken = useUserStore((state) => state.userToken);

    // Error flags
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    // Form Varibles
    const [user, setUser] = React.useState<User|null>()

    // Get the list of categories
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
            {/* Name */}
            <Typography variant="h4">
                {user?.firstName + " " + user?.lastName}
            </Typography>

            {/* Email */}
            <Typography variant="h4">
                {user?.email}
            </Typography>
        </>
    );
};

export default Profile;