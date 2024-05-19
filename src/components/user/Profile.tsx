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


    // Handles page change
    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    // Get the list of categories
    React.useEffect(() => {
        const getPetitions = () => {
            axios.get('http://localhost:3000/api/v1/petitions/categories')
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setCategories(response.data);
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };
        getPetitions();
    }, [setCategories]);

    return (
        <>
            {/* Search Bar */}
            <SearchBar/>

            {/* Paper for cards */}
            <Paper elevation={24} style={paper}>

                {/* Title */}
                <Typography variant="h4" style={titleStyle}>
                    Petitions
                </Typography>

                {/* List of cards */}
                {petition_rows()}

                {/* Pagination */}
                <div style={{display: "flex", justifyContent: "center"}}>
                    <Pagination
                        count={pageNum}
                        page={page}
                        color="primary"
                        onChange={handleChangePage}/>
                </div>
            </Paper>
        </>
    );
};

export default Profile;