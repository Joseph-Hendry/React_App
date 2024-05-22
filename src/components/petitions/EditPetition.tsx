import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useUserStore } from '../../store';
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
    CardHeader
} from '@mui/material';

// Global Variables
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const EditPetition = () => {

    // Petition ID
    const { id } = useParams();

    // Used for navigation
    const navigate = useNavigate();

    // User information
    const userId = useUserStore((state) => state.userId);
    const userToken = useUserStore((state) => state.userToken);

    // Petition Form Values
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');

    // Petition Picture
    const [petitionPicture, setPetitionPicture] = useState<File | null>(null);
    const [petitionPictureURL, setPetitionPictureURL] = useState('https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png');
    const [petitionOriginalPictureURL, setPetitionOriginalPictureURL] = useState('https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png');

    // Support Tiers
    const [deletedSupportTierIds, setDeletedSupportTierIds] = useState([-1])
    const [supportTiers, setSupportTiers] = useState([{ supportTierId: -1, title: '', description: '', cost: 0 }]);

    // Categories
    const [categories, setCategories] = useState<Category[] | null>(null);

    // Error Messages
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Get the list of categories
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

    // Load petition data
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
    }, [id, userToken]);

    // Gets the petition image
    React.useEffect(() => {
        const getPetitionImg = () => {
            axios.get(`http://localhost:3000/api/v1/petitions/${id}/image`, {responseType: "blob"})
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");

                    // Set picture
                    const pictureURL = URL.createObjectURL(response.data);
                    setPetitionOriginalPictureURL(pictureURL);
                    setPetitionPictureURL(pictureURL);
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };
        getPetitionImg();
    }, [id]);

    // Handle change petition picture
    const handlePetitionPictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setPetitionPicture(event.target.files[0]);
            setPetitionPictureURL(URL.createObjectURL(event.target.files[0]));
        }
    };

    // Handle revert petition picture
    const handleRevertPicture = () => {
        setPetitionPicture(null);
        setPetitionPictureURL(petitionOriginalPictureURL);
    };

    // Handles category change
    const handleChangeCategory = (event: SelectChangeEvent<typeof categoryId>) => {
        setCategoryId(event.target.value);
    };

    // Handle support tier change
    const handleSupportTierChange = (index: number, field: string, value: string) => {
        const updatedTiers = supportTiers.map((tier, i) => {
            if (i === index) {
                return { ...tier, [field]: field === 'cost' ? parseInt(value, 10) : value };
            }
            return tier;
        });
        setSupportTiers(updatedTiers);
    };

    // Handle adding a new support tiers
    const handleAddSupportTier = () => {
        if (supportTiers.length < 3) {
            setSupportTiers([...supportTiers, { supportTierId: -1, title: '', description: '', cost: 0 }]);
        }
    };

    // Handle removing a support tier
    const handleRemoveSupportTier = (index: number) => {
        // Add to deleted if it was existing support tier
        const tier = supportTiers[index];
        if (tier.supportTierId !== -1) {
            setDeletedSupportTierIds([...deletedSupportTierIds, tier.supportTierId]);
        }

        // Remove from petitions list
        if (supportTiers.length > 1) {
            const updatedTiers = supportTiers.filter((_, i) => i !== index);
            setSupportTiers(updatedTiers);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        navigate("/user/petitions");
    };

    // Handle update
    const handleUpdate = async () => {
        // Create request body
        const updatePetitionRequestBody = {
            title,
            description,
            categoryId: Number(categoryId)
        };
        console.log(JSON.stringify(updatePetitionRequestBody, null, 2));

        try {
            // Update petition details
            await axios.patch(`http://localhost:3000/api/v1/petitions/${id}`, updatePetitionRequestBody, {
                headers: {
                    "X-Authorization": userToken,
                },
            });

            // Update profile photo if it exists
            if (petitionPicture) {
                await axios.put(`http://localhost:3000/api/v1/petitions/${id}/image`, petitionPicture, {
                    headers: {
                        "X-Authorization": userToken,
                        "Content-Type": petitionPicture.type,
                    },
                });
            }

            // Delete removed support tiers
            for (const supportTierId of deletedSupportTierIds) {
                // eslint-disable-next-line eqeqeq
                if (supportTierId != -1) {
                    await axios.delete(`http://localhost:3000/api/v1/petitions/${id}/supportTiers/${supportTierId}`,  {
                        headers: {
                            "X-Authorization": userToken,
                        },
                    });
                }
            }

            // Update & Create new support tiers
            for (const supportTier of supportTiers) {

                // Get support tier info
                const { supportTierId, ...supportTierData } = supportTier;

                // Check for put or patch
                if (supportTierId === -1) {
                    await axios.put(`http://localhost:3000/api/v1/petitions/${id}/supportTiers`, supportTierData, {
                        headers: {
                            "X-Authorization": userToken,
                        },
                    });
                } else {
                    await axios.patch(`http://localhost:3000/api/v1/petitions/${id}/supportTiers/${supportTierId}`, supportTierData, {
                        headers: {
                            "X-Authorization": userToken,
                        },
                    });
                }
            }

            // Navigate to users petitions
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

                {/* Edit Petition Title */}
                <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
                    Edit Petition
                </Typography>

                {/* Petition Photo */}
                <Avatar
                    src={petitionPictureURL}
                    sx={{ width: 100, height: 100, mt: 2 }} />

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
                                onClick={handleRevertPicture}>
                                Revert
                            </Button>
                        </Grid>

                        {/* Title */}
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)} />
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
                        <CardHeader title="Support Tiers" />
                        <CardContent>
                            <Grid container spacing={2}>
                                {supportTiers.map((tier, index) => (
                                    <React.Fragment key={index}>

                                        {/* Support Tier Title */}
                                        <Grid item xs={12}>
                                            <Typography variant="h6">Support Tier {index + 1}</Typography>
                                        </Grid>

                                        {/* Title */}
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                label="Title"
                                                value={tier.title}
                                                onChange={(e) => handleSupportTierChange(index, 'title', e.target.value)} />
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
                                                onChange={(e) => handleSupportTierChange(index, 'description', e.target.value)} />
                                        </Grid>

                                        {/* Cost */}
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                label="Cost"
                                                value={tier.cost}
                                                onChange={(e) => handleSupportTierChange(index, 'cost', e.target.value)} />
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
                            <Button fullWidth variant="contained" onClick={handleUpdate}>
                                Save
                            </Button>
                        </Grid>
                    </Grid>

                    {/* Error Flag */}
                    {errorFlag && (
                        <Typography variant="body2" color="error">
                            {errorMessage}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default EditPetition;