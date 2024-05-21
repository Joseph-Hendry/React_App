import React from 'react';
import { useNavigate } from 'react-router-dom';
import {usePetitionSearchStore, usePetitionStore, useUserStore} from "../../store";
import axios from "axios";
import PetitionCard from "../petitions/PetitionCard";
import {Pagination, Paper, Typography} from "@mui/material";
import CSS from "csstype";
import Button from "@mui/material/Button";

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

const PetitionsProfile = () => {

    // For navigation
    const navigate = useNavigate();

    // Error flags
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    // User information
    const userId = useUserStore((state) => state.userId);

    // Petitions
    const [petitions, setPetitions] = React.useState<Petitions | null>(null);
    const setCategories = usePetitionStore((state) => state.setCategories);

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
        const petitionSearch: PetitionSearch = {
            startIndex : (page - 1) * ITEMS_PER_PAGE,
            count : ITEMS_PER_PAGE,
            ownerId : userId,
        }

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

        // Check page number
        if (page > pageNum) {
            setPage(pageNum);
        }
    }, [page, pageNum, petitions?.count, setPetitions, userId]);

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
    const petition_rows = () => petitions?.petitions.map((petition: Petition) => <PetitionCard key={ petition.petitionId } petition={petition} />);

    return (
        <>
            {/* Paper for cards */}
            <Paper elevation={24} style={paper}>

                {/* Title */}
                <Typography variant="h4" style={titleStyle}>
                    My Petitions
                </Typography>

                {/* Create Petition */}
                <Button onClick={() => {navigate("/petitions/create")}}>
                    Edit Profile
                </Button>

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

export default PetitionsProfile;