import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useUserStore } from '../../store';
import CSS from 'csstype';
import { SelectChangeEvent } from '@mui/material/Select';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
    Container,
    TextField,
    Button,
    Box,
    Typography,
    MenuItem,
    Grid,
    CssBaseline,
    Avatar,
    InputLabel,
    Select,
    OutlinedInput,
    FormControl,
    CardContent,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Snackbar, Alert
} from '@mui/material';

// Global Variables
const validImageTypes = new Set(['image/jpeg', 'image/png', 'image/gif']);

// Title CSS
const titleStyle: CSS.Properties = {
    color: "#333",
    fontWeight: "bold",
    textTransform: "uppercase",
};

const EditPetition = () => {

    // User and page variables
    const { id } = useParams();
    const navigate = useNavigate();
    const userToken = useUserStore((state) => state.userToken);

    // Petition Details
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');

    // Petition Image
    const [petitionImg, setPetitionImg] = useState<File | null>(null);
    const [petitionImgURL, setPetitionImgURL] = useState('https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png');
    const [petitionOriginalImgURL, setPetitionOriginalImgURL] = useState('https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png');

    // Valid flags
    const [titleValid, setTitleValid] = React.useState(true);
    const [descriptionValid, setDescriptionValid] = React.useState(true);
    const [imgValid, setImgValid] = React.useState(true);

    // Support Tiers
    const [changeSupportTier, updateSupportTier] = useState(0)
    const [supportTiers, setSupportTiers] = useState([{ supportTierId: -1, title: '', description: '', cost: 0 }]);

    // Categories
    const [categories, setCategories] = useState<Category[] | null>(null);

    // Dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentSupportTier, setCurrentSupportTier] = useState({ supportTierId: -1, title: '', description: '', cost: 0 });

    // Error Flags
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

    // Gets categories
    useEffect(() => {
        axios.get('http://localhost:3000/api/v1/petitions/categories')
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {});
    }, []);

    // Gets petitions details
    useEffect(() => {
        axios.get(`http://localhost:3000/api/v1/petitions/${id}`)
            .then((response) => {
                const petition = response.data;
                setTitle(petition.title);
                setDescription(petition.description);
                setCategoryId(petition.categoryId.toString());
                setSupportTiers(petition.supportTiers);
            })
            .catch((error) => {});
    }, [id, userToken, changeSupportTier]);

    // Gets petition image
    useEffect(() => {
        const getPetitionImg = () => {
            axios.get(`http://localhost:3000/api/v1/petitions/${id}/image`, {responseType: "blob"})
                .then((response) => {
                    const pictureURL = URL.createObjectURL(response.data);
                    setPetitionOriginalImgURL(pictureURL);
                    setPetitionImgURL(pictureURL);
                }, (error) => {});
        };
        getPetitionImg();
    }, [id]);


    // Change petition image
    const handleChangePetitionImg = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Get file
        const file = event.target.files?.[0];

        // Check file and extension
        if (file && validImageTypes.has(file.type)) {
            setImgValid(true)
            setPetitionImg(file);
            setPetitionImgURL(URL.createObjectURL(file));
        } else {
            setImgValid(false)
        }
    };

    // Revert petition image
    const handleRevertImg = () => {
        setImgValid(true)
        setPetitionImg(null);
        setPetitionImgURL(petitionOriginalImgURL);
    };

    const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Get and set value
        const temp = event.target.value;
        setTitle(temp);

        // Check if valid
        if (temp.length > 0) {
            setTitleValid(true);
        } else {
            setTitleValid(false);
        }
    }

    const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Get and set value
        const temp = event.target.value;
        setDescription(temp);

        // Check if valid
        if (temp.length > 0) {
            setDescriptionValid(true);
        } else {
            setDescriptionValid(false);
        }
    }

    // Change category
    const handleChangeCategory = (event: SelectChangeEvent<typeof categoryId>) => {
        setCategoryId(event.target.value);
    };

    // Edit support tier (open dialog)
    const handleEditSupportTier = (index: number) => {
        setCurrentSupportTier(supportTiers[index]);
        setDialogOpen(true);
    };

    // Close dialog
    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    // Change support tier (current editing dialog)
    const handleChangeSupportTierDialog = (field: string, value: string) => {
        setCurrentSupportTier({
            ...currentSupportTier,
            [field]: field === 'cost' ? parseInt(value, 10) : value
        });
    };

    // Save support tier edit
    const handleSupportTierSave = async () => {
        const { supportTierId, ...supportTierData } = currentSupportTier;
        try {
            // Add if new support tier
            if (supportTierId === -1) {
                await axios.put(`http://localhost:3000/api/v1/petitions/${id}/supportTiers`, supportTierData, {
                    headers: {
                        "X-Authorization": userToken,
                    },
                });
                // Edit if old support tier
            } else {
                await axios.patch(`http://localhost:3000/api/v1/petitions/${id}/supportTiers/${supportTierId}`, supportTierData, {
                    headers: {
                        "X-Authorization": userToken,
                    },
                });
            }

            // Update petition data
            updateSupportTier(changeSupportTier + 1);

            // Close dialog
            setDialogOpen(false);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    showSnackbar(error.response.statusText);
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

    // Add new support tier
    const handleAddSupportTier = () => {
        if (supportTiers.length < 3) {
            setCurrentSupportTier({supportTierId: -1, title: '', description: '', cost: 0});
            // setCurrentSupportTierIndex(index);
            setDialogOpen(true);
        }
    };

    // Remove support tier
    const handleRemoveSupportTier = async (index: number) => {
        // Get tier
        const tier = supportTiers[index];

        if (tier.supportTierId !== -1) {
            try {
                // Delete if not new
                await axios.delete(`http://localhost:3000/api/v1/petitions/${id}/supportTiers/${tier.supportTierId}`,  {
                    headers: {
                        "X-Authorization": userToken,
                    },
                });

                // Remove support tier from view
                const updatedTiers = supportTiers.filter((_, i) => i !== index);
                setSupportTiers(updatedTiers);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        showSnackbar(error.response.statusText);
                    } else if (error.request) {
                        showSnackbar('No response received from the server.');
                    } else {
                        showSnackbar('Error: ' + error.message);
                    }
                } else {
                    showSnackbar('An unexpected error occurred.');
                }
            }
        } else {
            // Remove support tier from view
            const updatedTiers = supportTiers.filter((_, i) => i !== index);
            setSupportTiers(updatedTiers);
        }
    };

    // Cancel edit
    const handleCancel = () => {
        navigate("/user/petitions");
    };

    // Save petition
    const handleSavePetition = async () => {
        // Get patch request body
        const updatePetitionRequestBody = {
            title,
            description,
            categoryId: Number(categoryId)
        };

        try {
            // Send patch request
            await axios.patch(`http://localhost:3000/api/v1/petitions/${id}`, updatePetitionRequestBody, {
                headers: {
                    "X-Authorization": userToken,
                },
            });

            // Update picture (if one added)
            if (petitionImg) {
                await axios.put(`http://localhost:3000/api/v1/petitions/${id}/image`, petitionImg, {
                    headers: {
                        "X-Authorization": userToken,
                        "Content-Type": petitionImg.type,
                    },
                });
            }

            // Navigate to user petitions page
            navigate("/user/petitions");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    showSnackbar(error.response.statusText);
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


    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>

                {/* Title */}
                <Typography variant="h4" style={titleStyle}>
                    Edit Petitions
                </Typography>

                {/* Petition Image*/}
                <Avatar
                    src={petitionImgURL}
                    sx={{ width: 200, height: 200, mt: 2, borderRadius: 2 }} />

                {/* Error Message */}
                {!imgValid && (
                    <Typography variant="body2" color="error" sx={{ mt: 1, textAlign: 'center' }}>
                        Please upload a valid profile image to sign up.
                    </Typography>
                )}

                {/* Petition Container */}
                <Box sx={{ mt: 3 }}>

                    {/* Petition Details */}
                    <Grid container spacing={2} alignItems="baseline">

                        {/* Upload Image */}
                        <Grid item xs={6} mb={2}>
                            <Button
                                fullWidth
                                variant="outlined"
                                component="label"
                                startIcon={<CloudUploadIcon />}>
                                Upload
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleChangePetitionImg}
                                />
                            </Button>
                        </Grid>

                        {/* Revert Image */}
                        <Grid item xs={6} mb={2}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="error"
                                component="label"
                                onClick={handleRevertImg}>
                                Revert
                            </Button>
                        </Grid>

                        {/* Title */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={title}
                                onChange={handleChangeTitle}
                                error={!titleValid}
                                helperText={!titleValid ? 'Title is required.' : ''}/>
                        </Grid>

                        {/* Description */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Description"
                                value={description}
                                onChange={handleChangeDescription}
                                error={!descriptionValid}
                                helperText={!descriptionValid ? 'Description is required.' : ''}/>
                        </Grid>

                        {/* Category */}
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="categories-label">Category</InputLabel>
                                <Select
                                    fullWidth
                                    labelId="categories-label"
                                    id="select-category"
                                    value={categoryId}
                                    label="Category"
                                    onChange={handleChangeCategory}
                                    input={<OutlinedInput id="select-category" label="Category" />}
                                    MenuProps={{ PaperProps: { style: { maxHeight: 224, width: 250 } } }}>
                                    {categories?.map((category) => (
                                        <MenuItem key={category.categoryId} value={category.categoryId.toString()}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {/* Support Tiers */}
                    <Paper sx={{ mt: 3 }} elevation={6}>
                        <CardContent>

                            {/* Container for each support tier */}
                            <Grid container spacing={2}>
                                {supportTiers.map((tier, index) => (
                                    <React.Fragment key={index}>

                                        {/* Heading */}
                                        <Grid item xs={12}>
                                            <Typography variant="h6">Support Tier {index + 1}</Typography>
                                        </Grid>

                                        {/* Title */}
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                disabled
                                                label="Title"
                                                value={tier.title}/>
                                        </Grid>

                                        {/* Description */}
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                disabled
                                                rows={2}
                                                label="Description"
                                                value={tier.description}/>
                                        </Grid>

                                        {/* Cost */}
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                disabled
                                                label="Cost"
                                                type="number"
                                                value={tier.cost}/>
                                        </Grid>

                                        {/* Edit */}
                                        <Grid item xs={6}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                onClick={() => handleEditSupportTier(index)}>
                                                Edit
                                            </Button>
                                        </Grid>

                                        {/* Remove */}
                                        <Grid item xs={6}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleRemoveSupportTier(index)}>
                                                Remove
                                            </Button>
                                        </Grid>
                                    </React.Fragment>
                                ))}
                            </Grid>
                        </CardContent>
                    </Paper>

                    <Grid container spacing={2} mt={1} mb={10}>

                        {/* Add Support Tier*/}
                        {supportTiers.length < 3 && (
                            <Grid item xs={12} mb={2}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={handleAddSupportTier}>
                                    Add Support Tier
                                </Button>
                            </Grid>
                        )}

                        {/* Cancel */}
                        <Grid item xs={12} sm={6}>
                            <Button fullWidth variant="outlined" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Grid>

                        {/* Save */}
                        <Grid item xs={12} sm={6}>
                            <Button fullWidth variant="contained" onClick={handleSavePetition}>
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            {/* Dialog Box */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>

                {/* Title */}
                <DialogTitle>Edit Support Tier</DialogTitle>
                <DialogContent>

                    {/* Text */}
                    <DialogContentText>
                        Update the details of the support tier below.
                    </DialogContentText>

                    {/* Title */}
                    <TextField
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={currentSupportTier.title}
                        onChange={(e) => handleChangeSupportTierDialog('title', e.target.value)}/>

                    {/* Description */}
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={2}
                        value={currentSupportTier.description}
                        onChange={(e) => handleChangeSupportTierDialog('description', e.target.value)}/>

                    {/* Cost */}
                    <TextField
                        margin="dense"
                        label="Cost"
                        type="number"
                        fullWidth
                        value={currentSupportTier.cost}
                        onChange={(e) => handleChangeSupportTierDialog('cost', e.target.value)}/>
                </DialogContent>

                {/* Buttons */}
                <DialogActions>

                    {/* Cancel */}
                    <Button onClick={handleCloseDialog} color={'error'}>Cancel</Button>

                    {/* Save */}
                    <Button onClick={handleSupportTierSave}>Save</Button>
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
        </Container>
    );
};

export default EditPetition;