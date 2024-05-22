import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from "../../store";
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

// Button CSS
const button: CSS.Properties = {
    margin: "20px",
    marginTop: "0",
    fontWeight: "bold",
    textTransform: "uppercase",
    width: "100%"
};

const PetitionsProfile = () => {

    // For navigation
    const navigate = useNavigate();

    // User information
    const userId = useUserStore((state) => state.userId);

    // Petitions
    const [petitions, setPetitions] = React.useState<Petitions | null>(null);

    // Categories
    const [categories, setCategories] = React.useState<Category[] | null>(null);

    // Pagination Variables
    const [page, setPage] = React.useState(1)
    const [pageNum, setPageNum] = React.useState(10)

    // Error flags
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    // Handles page change
    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    // Get the list of petitions
    React.useEffect(() => {

        // Set search conditions
        const ownerSearch: PetitionSearch = {
            startIndex: (page - 1) * ITEMS_PER_PAGE,
            // count: ITEMS_PER_PAGE,
            ownerId: userId,
        }

        const supporterSearch: PetitionSearch = {
            startIndex: (page - 1) * ITEMS_PER_PAGE,
            // count: ITEMS_PER_PAGE,
            supporterId: userId,
        }

        // Send request
        const getPetitions = async () => {
            try {
                // Get owner petitions
                const ownerResponse = await axios.get('http://localhost:3000/api/v1/petitions', {params: ownerSearch});
                const ownerPetitions: Petitions = ownerResponse.data;

                // Get supporting petitions
                const supportResponse = await axios.get('http://localhost:3000/api/v1/petitions', {params: supporterSearch});
                const supportPetitions: Petitions = supportResponse.data;

                // Add petitions together
                const combinedPetitions = ownerPetitions.petitions.concat(supportPetitions.petitions);

                // Use a Set to keep track of unique petition IDs
                const uniquePetitionIds = new Set();

                // Make unique
                const uniquePetitions = combinedPetitions.filter(petition => {
                    const isDuplicate = uniquePetitionIds.has(petition.petitionId);
                    uniquePetitionIds.add(petition.petitionId);
                    return !isDuplicate;
                });

                // Transform
                const similarPetitions: Petitions = {petitions: uniquePetitions, count: uniquePetitions.length}

                // Set petitions
                setPetitions(similarPetitions);

                // Set page numbers
                setPageNum(Math.max(1, Math.ceil((uniquePetitions.length || 0) / ITEMS_PER_PAGE)));

                // Check page number
                if (page > pageNum) {
                    setPage(pageNum);
                }

            } catch (error) {
                setErrorFlag(true);
                // @ts-ignore
                // console.error(error.response.statusText);
            }
        }
        getPetitions();
    }, [page, pageNum, userId]);

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
            {/* Paper for cards */}
            <Paper elevation={24} style={paper}>

                {/* Title */}
                <Typography variant="h4" style={titleStyle}>
                    My Petitions
                </Typography>

                {/* Create Petition */}
                <Button style={button} onClick={() => {navigate("/petitions/create")}}>
                    Create Petition
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