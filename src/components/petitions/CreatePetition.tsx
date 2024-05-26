import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Card,
    CardContent,
    Snackbar,
    Alert
} from '@mui/material';


// Global Variables
const validImageTypes = new Set(['image/jpeg', 'image/png', 'image/gif']);

// Title CSS
const titleStyle: CSS.Properties = {
    color: "#333",
    fontWeight: "bold",
    textTransform: "uppercase",
};

const CreatePetition = () => {

    // For navigation
    const navigate = useNavigate();

    // User information
    const userToken = useUserStore((state) => state.userToken);

    // Form values
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');

    // Petition photo
    const [petitionImg, setPetitionImg] = React.useState<File | null>(null);
    const [petitionImgURL, setPetitionImgURL] = React.useState('https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png');

    // Valid flags
    const [titleValid, setTitleValid] = React.useState(false);
    const [descriptionValid, setDescriptionValid] = React.useState(false);
    const [imgValid, setImgValid] = React.useState(false);

    // Categories
    const [categories, setCategories] = React.useState<Category[] | null>(null);

    // Support Tiers
    const [supportTiers, setSupportTiers] = useState([{ title: '', description: '', cost: 0 }]);

    // Error Flags
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

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

    // Handle petition picture change
    const handlePetitionPictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    // Handle remove profile picture
    const handleRemove = () => {
        setImgValid(false)
        setPetitionImg(null)
        setPetitionImgURL('https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png');
    };

    const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const temp = event.target.value;
        setTitle(temp)

        if (temp.length > 0) {
            setTitleValid(true);
        } else {
            setTitleValid(false);
        }
    }

    const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        const temp = event.target.value;
        setDescription(temp)

        if (temp.length > 0) {
            setDescriptionValid(true);
        } else {
            setDescriptionValid(false);
        }
    }

    // Handles category change
    const handleChangeCategory = (event: SelectChangeEvent<typeof categoryId>) => {
        setCategoryId(event.target.value);
    };

    // Handle support tier change
    const handleSupportTierChange = (index: number, field: string, value: string) => {
        const updatedTiers = supportTiers.map((tier, i) => {
            if (i === index) {
                return { ...tier, [field]: field === 'cost' ? parseInt(value, 10) : value  };
            }
            return tier;
        });
        setSupportTiers(updatedTiers);
    };

    // Handle adding a new support tier
    const handleAddSupportTier = () => {
        if (supportTiers.length < 3) {
            setSupportTiers([...supportTiers, { title: '', description: '', cost: 0 }]);
        }
    };

    // Handle removing a support tier
    const handleRemoveSupportTier = (index: number) => {
        if (supportTiers.length > 1) {
            const updatedTiers = supportTiers.filter((_, i) => i !== index);
            setSupportTiers(updatedTiers);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        navigate("/user/petitions");
    }

    // Handle create
    const handleCreate = async () => {
        // Create the request body
        const createRequestBody = {
            title,
            description,
            categoryId: Number(categoryId),
            supportTiers,
        }

        try {
            // Create the petition
            const response = await axios.post('http://localhost:3000/api/v1/petitions', createRequestBody, {
                headers: {
                    "X-Authorization": userToken,
                },
            });

            // Upload profile photo
            await axios.put(`http://localhost:3000/api/v1/petitions/${response.data.petitionId}/image`, petitionImg, {
                headers: {"X-Authorization": userToken, "Content-Type": petitionImg?.type,},
            });

            // Navigate to my petitions page
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

                {/* Create Petition Title */}
                <Typography variant="h4" style={titleStyle}>
                    Create Petition
                </Typography>

                {/* Petition Photo */}
                <Avatar
                    src={petitionImgURL}
                    sx={{ width: 200, height: 200, mt: 2, borderRadius: 2 }} />

                {/* Error Message */}
                {!imgValid && (
                    <Typography variant="body2" color="error" sx={{ mt: 1, textAlign: 'center' }}>
                        Please upload a valid profile image to sign up.
                    </Typography>
                )}

                {/* Form Grid */}
                <Box sx={{ mt: 3 }}>
                    <Grid container spacing={2} alignItems="baseline">

                        {/* Upload Button */}
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
                                    onChange={handlePetitionPictureChange}
                                />
                            </Button>
                        </Grid>

                        {/* Remove Button */}
                        <Grid item xs={6} mb={2}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="error"
                                component="label"
                                onClick={handleRemove}>
                                Remove
                            </Button>
                        </Grid>

                        {/* Title */}
                        <Grid item xs={12}>
                            <TextField
                                required
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
                                required
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
                                    required
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
                    <Card sx={{ mt: 3 }}>
                        <CardContent>
                            <Grid container spacing={2}>
                                {supportTiers.map((tier, index) => (
                                    <React.Fragment key={index}>

                                        {/* Support Tier Title */}
                                        <Grid item xs={12}>
                                            <Typography variant="h6">Support Tier {index + 1}</Typography>
                                        </Grid>

                                        {/* Title*/}
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                label="Title"
                                                value={tier.title}
                                                onChange={(e) => handleSupportTierChange(index, 'title', e.target.value)}
                                                error={!(tier.title.length > 0)}
                                                helperText={!(tier.title.length > 0) ? 'Title is required.' : ''}/>
                                        </Grid>

                                        {/* Description */}
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                multiline
                                                rows={2}
                                                label="Description"
                                                value={tier.description}
                                                onChange={(e) => handleSupportTierChange(index, 'description', e.target.value)}
                                                error={!(tier.description.length > 0)}
                                                helperText={!(tier.description.length > 0) ? 'Description is required.' : ''}/>
                                        </Grid>

                                        {/* Cost */}
                                        <Grid item xs={12}>
                                            <TextField
                                                margin="dense"
                                                label="Cost"
                                                type="number"
                                                fullWidth
                                                rows={2}
                                                value={tier.cost}
                                                onChange={(e) => handleSupportTierChange(index, 'cost', e.target.value)}
                                                error={!(tier.cost > 0)}
                                                helperText={!(tier.cost > 0) ? 'Cost is required.' : ''}/>
                                        </Grid>

                                        {/* Remove Support Tier */}
                                        <Grid item xs={12}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleRemoveSupportTier(index)}>
                                                Remove Tier
                                            </Button>
                                        </Grid>
                                    </React.Fragment>
                                ))}

                                {/* Add Support Tier */}
                                {supportTiers.length < 3 && (
                                    <Grid item xs={12}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            onClick={handleAddSupportTier}>
                                            Add Support Tier
                                        </Button>
                                    </Grid>
                                )}
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Container for Cancel & Submit */}
                    <Grid container spacing={2} mt={3} mb={10}>
                        {/* Cancel Button */}
                        <Grid item xs={12} sm={6}>
                            <Button fullWidth variant="outlined" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Grid>

                        {/* Save Button */}
                        <Grid item xs={12} sm={6}>
                            <Button disabled={!petitionImg} fullWidth variant="contained" onClick={handleCreate}>
                                Create
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

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

export default CreatePetition;
