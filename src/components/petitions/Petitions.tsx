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

// Constants
const ITEMS_PER_PAGE: number = 10;

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
    const petitionSearch = usePetitionSearchStore((state) => state.petitionSearch)

    // Pagination Variables
    const [page, setPage] = React.useState(1)
    const [pageNum, setPageNum] = React.useState(10)

    // Handles page change
    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    // Get the list of petitions
    React.useEffect(() => {

        // Set pagination variables
        petitionSearch.startIndex = (page - 1) * ITEMS_PER_PAGE;
        petitionSearch.count = ITEMS_PER_PAGE;

        // Send request
        const getPetitions = () => {
            axios.get('http://localhost:3000/api/v1/petitions', {params: petitionSearch})
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setPetitions(response.data);
                    setPageNum(Math.ceil((petitions?.count ?? 0) / ITEMS_PER_PAGE))
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };
        getPetitions();
    }, [page, petitionSearch, petitions?.count, setPetitions]);

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

export default Petitions;