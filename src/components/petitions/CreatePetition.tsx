import React, { useState } from 'react';
import axios from 'axios';
import { useUserStore } from '../../store';
import {
    Container,
    TextField,
    Button,
    Box,
    Typography,
    MenuItem,
    InputAdornment,
    IconButton,
    Grid
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const CreatePetition = () => {
    // User information
    const userId = useUserStore((state) => state.userId);
    const userToken = useUserStore((state) => state.userToken);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [supportTiers, setSupportTiers] = useState([{ tier: '' }]);
    const [image, setImage] = useState(null);

    // Error flags
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Handle form submission
    const handleSubmit = async () => {
        if (!title || !categoryId || !supportTiers.length || !image) {
            setErrorFlag(true);
            setErrorMessage('Please fill in all required fields.');
            return;
        }

        // Construct request body
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('categoryId', categoryId);
        formData.append('supportTiers', JSON.stringify(supportTiers));
        formData.append('image', image);

        try {
            await axios.post('http://localhost:3000/api/v1/petitions', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-Authorization': userToken,
                },
            });
            // Redirect or update UI to reflect new petition
        } catch (error) {
            setErrorFlag(true);
            // setErrorMessage(error.toString());
        }
    };

    // Handle adding support tiers
    const handleAddTier = () => {
        setSupportTiers([...supportTiers, { tier: '' }]);
    };

    // Handle removing support tiers
    const handleRemoveTier = (index: number) => {
        const newSupportTiers = supportTiers.filter((_, idx) => idx !== index);
        setSupportTiers(newSupportTiers);
    };

    // Handle support tier change
    const handleTierChange = (index: number, value: string) => {
        const newSupportTiers = supportTiers.map((tier, idx) => (idx === index ? { tier: value } : tier));
        setSupportTiers(newSupportTiers);
    };

    // Handle file change
    const handleFileChange = (event: { target: { files: any[]; }; }) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif')) {
            setImage(file);
        } else {
            setErrorFlag(true);
            setErrorMessage('Please select a valid image file (png, jpeg, gif).');
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Create Petition
                </Typography>
                <Box component="form" sx={{ mt: 3 }}>
                    <TextField
                        required
                        fullWidth
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <TextField
                        required
                        fullWidth
                        select
                        label="Category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        margin="normal"
                    >
                        {/* Replace the following options with categories fetched from your server */}
                        <MenuItem value={1}>Category 1</MenuItem>
                        <MenuItem value={2}>Category 2</MenuItem>
                        <MenuItem value={3}>Category 3</MenuItem>
                    </TextField>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Support Tiers
                    </Typography>
                    {supportTiers.map((tier, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            <TextField
                                fullWidth
                                label={`Support Tier ${index + 1}`}
                                value={tier.tier}
                                onChange={(e) => handleTierChange(index, e.target.value)}
                                margin="normal"
                            />
                            <IconButton onClick={() => handleRemoveTier(index)} disabled={supportTiers.length <= 1}>
                                <VisibilityOff />
                            </IconButton>
                        </Box>
                    ))}
                    {supportTiers.length < 3 && (
                        <Button onClick={handleAddTier} sx={{ mt: 2 }}>
                            Add Support Tier
                        </Button>
                    )}
                    <Button variant="contained" component="label" sx={{ mt: 3, mb: 2 }}>
                        Upload Image
                        {/*<input type="file" hidden onChange={handleFileChange} />*/}
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleSubmit}
                    >
                        Create Petition
                    </Button>
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

export default CreatePetition;