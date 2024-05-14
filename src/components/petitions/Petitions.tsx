import * as React from 'react';
import PetitionCard from "./PetitionCard";
import SearchBar from "./SearchBar";
import { usePetitionStore } from "../../store";
import axios from "axios";
import CSS from 'csstype';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

import {
    Paper,
    Typography
} from '@mui/material';

// Paper CSS
const paper: CSS.Properties = {
    padding: "10px",
    margin: "20px",
    width: "fit-content",
    maxWidth: "965px",
    minWidth: "320",
    display: "inline-block"
};

// Title CSS
const titleStyle: CSS.Properties = {
    margin: "20px",
    color: "#333",
    fontWeight: "bold",
    textTransform: "uppercase",
};

const Petitions = () => {

    // Error flags
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    // Petitions
    const petitions = usePetitionStore((state) => state.petitions);
    const setPetitions = usePetitionStore((state) => state.setPetitions);
    const setCategories = usePetitionStore((state) => state.setCategories);

    // Get the list of petitions
    React.useEffect(() => {
        const getPetitions = () => {
            axios.get('http://localhost:3000/api/v1/petitions', {})
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setPetitions(response.data);
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };
        getPetitions();
    }, [setPetitions]);

    // Get the list of categories
    React.useEffect(() => {
        const getPetitions = () => {
            axios.get('http://localhost:3000/api/v1/petitions/categories', {})
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

    // Get the cards
    const petition_rows = () => petitions?.petitions.map((petition: Petition) => <PetitionCard key={ petition.petitionId } petition={petition} />);

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
            </Paper>
        </>
    );
};

export default Petitions;