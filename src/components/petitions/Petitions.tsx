import * as React from 'react';
import PetitionCard from "./PetitionCard";
import SearchBar from "./SearchBar";
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
    const [petitions, setPetitions] = React.useState<Petitions | null>();
    const [petitionSearch, setPetitionSearch] = React.useState<PetitionSearch>({startIndex: 1, count: ITEMS_PER_PAGE});

    // Categories
    const [categories, setCategories] = React.useState<Category[] | null>(null);

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
            axios.get('http://localhost:3000/api/v1/petitions', { params: petitionSearch })
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setPetitions(response.data);
                    setPageNum(Math.max(1, Math.ceil((response.data?.count || 0) / ITEMS_PER_PAGE)));
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };
        getPetitions();

        // Check page number
        if (page > pageNum) {
            setPage(pageNum);
        }
    }, [page, pageNum, petitionSearch]);

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

    // Get the cards
    const petition_rows = () => petitions?.petitions.map((petition: Petition) => <PetitionCard key={ petition.petitionId } petition={petition} categories={categories} />);

    return (
        <>
            {/* Search Bar */}
            <SearchBar setPetitionSearch={setPetitionSearch}/>

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