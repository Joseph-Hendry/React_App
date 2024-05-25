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
    DialogTitle
} from '@mui/material';

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
    const [petitionPicture, setPetitionImg] = useState<File | null>(null);
    const [petitionPictureURL, setPetitionImgURL] = useState('https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png');
    const [petitionOriginalPictureURL, setPetitionOriginalPictureURL] = useState('https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png');

    // Support Tiers
    const [changeSupportTier, updateSupportTier] = useState(0)
    const [supportTiers, setSupportTiers] = useState([{ supportTierId: -1, title: '', description: '', cost: 0 }]);

    // Categories
    const [categories, setCategories] = useState<Category[] | null>(null);

    // Dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentSupportTier, setCurrentSupportTier] = useState({ supportTierId: -1, title: '', description: '', cost: 0 });
    // const [currentSupportTierIndex, setCurrentSupportTierIndex] = useState<number | null>(null);

    // Error Flags
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState('Error :(');

    // Gets categries
    useEffect(() => {
        axios.get('http://localhost:3000/api/v1/petitions/categories')
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
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
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
    }, [id, userToken, changeSupportTier]);

    // Gets petition image
    useEffect(() => {
        const getPetitionImg = () => {
            axios.get(`http://localhost:3000/api/v1/petitions/${id}/image`, {responseType: "blob"})
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    const pictureURL = URL.createObjectURL(response.data);
                    setPetitionOriginalPictureURL(pictureURL);
                    setPetitionImgURL(pictureURL);
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };
        getPetitionImg();
    }, [id]);


    // Change petition image
    const handleChangePetitionImg = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setPetitionImg(event.target.files[0]);
            setPetitionImgURL(URL.createObjectURL(event.target.files[0]));
        }
    };

    // Revert petition image
    const handleRevertImg = () => {
        setPetitionImg(null);
        setPetitionImgURL(petitionOriginalPictureURL);
    };

    // Change category
    const handleChangeCategory = (event: SelectChangeEvent<typeof categoryId>) => {
        setCategoryId(event.target.value);
    };

    // Edit support tier (open dialog)
    const handleEditSupportTier = (index: number) => {
        setCurrentSupportTier(supportTiers[index]);
        // setCurrentSupportTierIndex(index);
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
            setErrorFlag(true);
            setErrorMessage("Error :(");
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
                setErrorFlag(true);
                setErrorMessage("Error :(");
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
            if (petitionPicture) {
                await axios.put(`http://localhost:3000/api/v1/petitions/${id}/image`, petitionPicture, {
                    headers: {
                        "X-Authorization": userToken,
                        "Content-Type": petitionPicture.type,
                    },
                });
            }

            // Navigate to user petitions page
            navigate("/user/petitions");
        } catch (error) {
            setErrorFlag(true);
            setErrorMessage("Error :(");
        }
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
                    src={petitionPictureURL}
                    sx={{ width: 200, height: 200, mt: 2, borderRadius: 2 }} />

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
                                onChange={(e) => setTitle(e.target.value)} />
                        </Grid>

                        {/* Description */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)} />
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

                    {/* Error flag */}
                    {errorFlag && (
                        <Typography variant="body2" color="error">
                            {errorMessage}
                        </Typography>
                    )}
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
        </Container>
    );
};

export default EditPetition;