import * as React from 'react';
import axios from "axios";
import {useUserStore} from "../../store";
import {
    Paper,
    Typography,
    Pagination, Avatar
} from '@mui/material';

const Profile = () => {

    // User information
    const userId = useUserStore((state) => state.userId);
    const userToken = useUserStore((state) => state.userToken);
    const setUserId = useUserStore((state) => state.setUserId);
    const setUserToken = useUserStore((state) => state.setUserToken);

    // Error flags
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    // Form Varibles
    const [user, setUser] = React.useState<User|null>()

    // Profile photo
    const [profileImageURL, setProfileImageURL] = React.useState("https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png");

    // Gets the users profile image
    React.useEffect(() => {
        const getPetitionOwnerImg = () => {
            axios.get(`http://localhost:3000/api/v1/users/${userId}/image`, {responseType: "blob"})
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setProfileImageURL(URL.createObjectURL(response.data));
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };
        getPetitionOwnerImg();
    }, [userId, setUserId]);

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
    }, [userId, setUserId, userToken, setUserToken]);

    return (
        <>

            {/* Profile Photo */}
            <Avatar
                src={profileImageURL}
                sx={{ width: 200, height: 200 }}/>

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