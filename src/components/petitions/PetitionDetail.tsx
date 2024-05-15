import * as React from 'react';
import PetitionCard from "./PetitionCard";
import SearchBar from "./SearchBar";
import {
    usePetitionSearchStore,
    usePetitionStore} from "../../store";
import axios from "axios";
import CSS from 'csstype';

import {
    Paper,
    Typography,
    Pagination
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

const PetitionDetail = () => {

    // Error flags
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    return (
        <>
            {/* Paper for cards */}
            <Paper elevation={24} style={paper}>

                {/* Title */}
                <Typography variant="h4" style={titleStyle}>
                    Petitions
                </Typography>
            </Paper>
        </>
    )
}

export default PetitionDetail;