import * as React from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import CSS from 'csstype';
import { useUserStore } from "../../store";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GroupsIcon from '@mui/icons-material/Groups';
import HandshakeIcon from '@mui/icons-material/Handshake';
import {
    Alert,
    Avatar, Button,
    Card,
    CardMedia,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Divider,
    Grid,
    Paper, Snackbar,
    Typography
} from '@mui/material';
import Box from "@mui/material/Box";
import PetitionCard from "./PetitionCard";
import TextField from "@mui/material/TextField";

// Background Paper CSS
const paperBackground: CSS.Properties = {
    padding: "10px",
    margin: "20px",
    width: "800px",
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

    // For navigation
    const navigate = useNavigate();

    // Petition ID
    const { id } = useParams();

    // User information
    const userId = useUserStore((state) => state.userId);
    const userToken = useUserStore((state) => state.userToken);

    // Petitions
    const [petition, setPetition] = React.useState<PetitionFull>();
    const [petitions, setPetitions] = React.useState<Petitions>();

    // Images
    const [petitionImageURL, setPetitionImageURL] = React.useState("https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png");
    const [petitionOwnerImageURL, setPetitionOwnerImageURL] = React.useState("https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png");

    // Categories
    const [categoryName, setCategoryName] = React.useState("");
    const [categories, setCategories] = React.useState<Category[] | null>(null);

    // Support Petition
    const [selectedSupportTierId, setSelectedSupportTierId] = React.useState(-1);
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');

    // Error flags
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

    // Get the petition
    React.useEffect(() => {
        const getPetition = () => {
            axios.get(`http://localhost:3000/api/v1/petitions/${id}`)
                .then((response) => {
                    setPetition(response.data);
                }, (error) => {});
        };
        getPetition();
    }, [id]);

    // Gets the petition image
    React.useEffect(() => {
        const getPetitionImg = () => {
            axios.get(`http://localhost:3000/api/v1/petitions/${id}/image`, {responseType: "blob"})
                .then((response) => {
                    setPetitionImageURL(URL.createObjectURL(response.data));
                }, (error) => {});
        };
        getPetitionImg();
    }, [id]);

    // Get the list of categories
    React.useEffect(() => {
        const getPetitions = () => {
            axios.get('http://localhost:3000/api/v1/petitions/categories')
                .then((response) => {
                    setCategories(response.data);
                }, (error) => {});
        };
        getPetitions();
    }, []);

    // Gets the petition owners image
    React.useEffect(() => {
        const getPetitionOwnerImg = () => {
            axios.get(`http://localhost:3000/api/v1/users/${petition?.ownerId}/image`, {responseType: "blob"})
                .then((response) => {
                    setPetitionOwnerImageURL(URL.createObjectURL(response.data));
                }, (error) => {});
        };

        if (petition?.ownerId) {
            getPetitionOwnerImg();
        }
    }, [petition?.ownerId]);

    // Get the category name
    React.useEffect(() => {
        const getPetitionsCategory = () => {
            if (categories && categories.length > 0) {
                const category = categories.find((category) => category.categoryId === petition?.categoryId);
                if (category) {
                    setCategoryName(category.name);
                } else {
                    setCategoryName("Unknown");
                }
            } else {
                setCategoryName("Unknown");
            }
        };
        getPetitionsCategory();
    }, [categories, petition?.categoryId]);

    // Get the list of similar petitions
    React.useEffect(() => {

        // Set search params
        const categorySearch = {
            startIndex: 0,
            categoryIds: [String(petition?.categoryId)],
            // sortBy: "CREATED_ASC",
        }
        const ownerSearch = {
            startIndex: 0,
            ownerId: String(petition?.ownerId),
            // sortBy: "CREATED_ASC",
        }

        // Send request
        const getPetitions = async () => {
            try {
                // Get category petitions
                const categoryResponse = await axios.get('http://localhost:3000/api/v1/petitions', {params: categorySearch});
                const categoryPetitions: Petitions = categoryResponse.data;

                // Get owner petitions
                const ownerResponse = await axios.get('http://localhost:3000/api/v1/petitions', {params: ownerSearch});
                const ownerPetitions: Petitions = ownerResponse.data;

                // Add petitions together
                const combinedPetitions = categoryPetitions.petitions.concat(ownerPetitions.petitions);

                // Use a Set to keep track of unique petition IDs
                const uniquePetitionIds = new Set();

                // Make unique
                const uniquePetitions = combinedPetitions.filter(petition => {
                    const isDuplicate = uniquePetitionIds.has(petition.petitionId);
                    uniquePetitionIds.add(petition.petitionId);
                    return !isDuplicate;
                });

                // Remove current petition
                const similarPetitions = uniquePetitions.filter(petitionS => petitionS.petitionId !== petition?.petitionId);

                // Transform
                const similarPetitionsC: Petitions = {petitions: similarPetitions, count: similarPetitions.length}

                // Set petitions
                setPetitions(similarPetitionsC);

            } catch (error) {}
        }

        if (petition?.categoryId) {
            getPetitions();
        }
    }, [petition?.categoryId, petition?.ownerId, petition?.petitionId]);

    // Supports a petition
    const supportPetition = async () => {
        try {
            // Send request
            await axios.post(`http://localhost:3000/api/v1/petitions/${id}/supporters`, {
                supportTierId: selectedSupportTierId,
                message: message ? message : undefined,
            }, {headers: {"X-Authorization": userToken}});

            // Close dialog box
            setOpen(false);

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const statusCode = error.response.status;

                    if (statusCode === 401) {
                        showSnackbar("Please login to support a petition.");
                    } else {
                        showSnackbar(error.response.statusText);
                    }
                } else if (error.request) {
                    showSnackbar('No response received from the server.');
                } else {
                    showSnackbar('Error: ' + error.message);
                }
            } else {
                showSnackbar('An unexpected error occurred.');
            }
        }
    };

    const showSnackbar = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    // Handles open dialog
    const handleOpenSupport = (supportTierId: number) => {
        setSelectedSupportTierId(supportTierId);
        setOpen(true);
    };

    // Handles close dialog
    const handleCloseSupport = () => {
        setOpen(false);
    };

    // Handles delete petition
    const handleDelete = () => {
        axios.delete(`http://localhost:3000/api/v1/petitions/${id}`, {headers: { "X-Authorization": userToken }})
            .then(() => {
                // Handle success
                setOpen(false);
                navigate("/user/petitions")
            })
            .catch((error) => {
                // Handle error
                console.error(error.response.statusText);
            });
    }

    // Get the petition cards
    const petition_rows = () => petitions?.petitions.map((petition: Petition) => (
        <Box key={petition.petitionId} sx={{ minWidth: 300, marginRight: 2 }}>
            <PetitionCard petition={petition} categories={categories} />
        </Box>
    ));

    // Format the date
    let formattedDate = "'N/A";
    if (petition && petition.creationDate) {
        formattedDate = new Date(petition.creationDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC'
        });
    }

    return (
        <>
            {/* Paper for cards */}
            <Paper elevation={24} style={paperBackground}>

                {/* Title */}
                <Typography variant="h4" style={titleStyle}>
                    {petition?.title}
                </Typography>

                {/* Hero Image */}
                <Box sx={{ width: "100%", display: 'flex', textAlign: 'left'}}>
                    {/* Left side with the image */}
                    <CardMedia
                        component="img"
                        sx={{ width: 450, height: 450 }}
                        image={petitionImageURL}
                    />

                    <Box sx={{ marginLeft: 1 }} >
                        {/* Profile Photo & Name Box */}
                        <Box sx={{ flex: "none", display: "flex", justifyContent: "left", marginBottom: 1 }} >

                            {/* Profile Photo */}
                            <Avatar
                                src={petitionOwnerImageURL}
                                sx={{ width: 47, height: 47, marginRight: 1 }}
                            />

                            {/* Name & Category Box */}
                            <Box >
                                {/* Owner */}
                                <Typography variant="subtitle1" color="text.secondary">
                                    {petition?.ownerFirstName + " " + petition?.ownerLastName}
                                </Typography>

                                {/* Creation Date */}
                                <Typography variant="body2" color="text.secondary">
                                    {formattedDate}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Category Chip */}
                        <Box sx={{ marginBottom: 1 }}>
                            <Chip variant="outlined" label={categoryName} sx={{ minWidth: 100, justifyContent: "left" }} />
                        </Box>

                        {/* Funds Raised Chip */}
                        <Box sx={{ marginBottom: 1 }}>
                            <Chip icon={<HandshakeIcon />} variant="outlined" label={"  $" + petition?.moneyRaised ? 0 : petition?.moneyRaised} sx={{ minWidth: 100, justifyContent: "left" }} />
                        </Box>

                        {/* Supporters Chip */}
                        <Box sx={{ marginBottom: 1 }}>
                            <Chip icon={<GroupsIcon />} variant="outlined" label={petition?.numberOfSupporters} sx={{ minWidth: 100, justifyContent: "left" }}/>
                        </Box>

                        {/* Description Title */}
                        <Typography variant="subtitle2">
                            Description
                        </Typography>

                        {/* Description Body */}
                        <Typography variant="body2" maxWidth={300} mb={3}>
                            {petition?.description}
                        </Typography>

                        {/* Edit Petition */}
                        {userId === petition?.ownerId && (
                            <>
                                <Divider/>
                                <Box m={3} width={250}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        onClick={() => navigate(`/petitions/${id}/edit`)}>
                                        Edit
                                    </Button>
                                </Box>
                                <Box m={3} width={250}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="error"
                                        onClick={handleDelete}>
                                        Delete
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>

                {/* Content Below Box */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>

                    {/* Support Tiers Title */}
                    <Typography variant="h5" style={titleStyle}>
                        Support Tiers (Click to Support)
                    </Typography>

                    {/* Grid of Support Tiers */}
                    <Grid container spacing={3}>
                        {petition?.supportTiers.map((supportTier, index) => (
                            <React.Fragment key={index} >
                                <Grid item xs={4} textAlign={"left"} onClick={() => handleOpenSupport(supportTier.supportTierId)}>
                                    <Card>
                                        {/* Title */}
                                        <Typography gutterBottom variant="h5" m={1}>
                                            {supportTier.title}
                                        </Typography>

                                        {/* Cost Chip*/}
                                        <Chip icon={<AttachMoneyIcon />}  variant="outlined" label={supportTier?.cost} />

                                        {/* Description */}
                                        <Typography variant="body2" maxWidth={300} m={1}>
                                            {supportTier?.description}
                                        </Typography>
                                    </Card>
                                </Grid>
                            </React.Fragment>
                        ))}
                    </Grid>

                    {/* Similar Petitions Title */}
                    <Typography variant="h5" style={titleStyle}>
                        Similar Petitions
                    </Typography>

                    {/* Scrollable box */}
                    <Box sx={{ display: 'flex', overflowX: 'auto', width: '100%' }}>
                        {/* List of cards */}
                        {petition_rows()}
                    </Box>
                </Box>
            </Paper>

            {/* Dialog Box */}
            <Dialog open={open} onClose={handleCloseSupport}>
                <DialogTitle>Support Petition</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Optional Message"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSupport} color="error">
                        Cancel
                    </Button>
                    <Button onClick={supportPetition} color="primary">
                        Support
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for error messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    )
}

export default PetitionDetail;