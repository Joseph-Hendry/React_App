import * as React from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";
import CSS from 'csstype';
import {usePetitionStore} from "../../store";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GroupsIcon from '@mui/icons-material/Groups';
import {
    Avatar,
    Card,
    CardMedia,
    Chip,
    Paper,
    Typography
} from '@mui/material';
import Box from "@mui/material/Box";
import PetitionCard from "./PetitionCard";

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

const PetitionDetail = () => {

    // Petition ID
    const { id } = useParams();

    // Error flags
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    // Petitions
    const [petition, setPetition] = React.useState<PetitionFull>()
    const [petitions, setPetitions] = React.useState<Petitions>()

    // Images
    const [petitionImageURL, setPetitionImageURL] = React.useState("https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png");
    const [petitionOwnerImageURL, setPetitionOwnerImageURL] = React.useState("https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png");

    // Categories
    const [categoryName, setCategoryName] = React.useState("");
    const categories = usePetitionStore((state) => state.categories);
    const setCategories = usePetitionStore((state) => state.setCategories);

    // Get the petition
    React.useEffect(() => {
        const getPetition = () => {
            axios.get(`http://localhost:3000/api/v1/petitions/${id}`)
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setPetition(response.data);
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };
        getPetition();
    }, [id]);

    // Gets the petition image
    React.useEffect(() => {
        const getPetitionImg = () => {
            axios.get(`http://localhost:3000/api/v1/petitions/${id}/image`, {responseType: "blob"})
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setPetitionImageURL(URL.createObjectURL(response.data));
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };
        getPetitionImg();
    }, [id]);

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

    // Gets the petition owners image
    React.useEffect(() => {
        const getPetitionOwnerImg = () => {
            axios.get(`http://localhost:3000/api/v1/users/${petition?.ownerId}/image`, {responseType: "blob"})
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setPetitionOwnerImageURL(URL.createObjectURL(response.data));
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };
        getPetitionOwnerImg();
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

        // Set pagination variables
        const petitionSearch: PetitionSearch = {
            startIndex: 0,
            categoryIds: [Number(petition?.categoryId)],
            // ownerId: petition?.ownerId,
            sortBy: "CREATED_ASC",
            count: 2
        }

        // Send request
        const getPetitionsCat = () => {
            axios.get('http://localhost:3000/api/v1/petitions', {params: petitionSearch})
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setPetitions(response.data);
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };
        getPetitionsCat();
    }, [petition?.categoryId, petition?.ownerId]);

    // Get the support tier cards
    const support_tier_rows = () => petition?.supportTiers.map((supportTier: SupportTier) => <SupportTierCard key={ supportTier.supportTierId } supportTier={supportTier} />);

    // Get the petition cards
    const petition_rows = () => petitions?.petitions.map((petition: Petition) => <PetitionCard key={ petition.petitionId } petition={petition} />);

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
            <Paper elevation={24} style={paper}>

                {/* Title */}
                <Typography variant="h4" style={titleStyle}>
                    {petition?.title}
                </Typography>

                {/* Hero Image */}
                <Box sx={{ display: 'flex', textAlign: 'left'}}>
                    {/* Left side with the image */}
                    <CardMedia
                        component="img"
                        sx={{ width: 300 }}
                        image={petitionImageURL}
                        alt="Auction hero"
                    />

                    <Box sx={{ marginLeft: 1}} >
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
                            <Chip icon={<AttachMoneyIcon />} variant="outlined" label={petition?.moneyRaised} sx={{ minWidth: 100, justifyContent: "left" }} />
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
                        <Typography variant="body2" maxWidth={300}>
                            {petition?.description}
                        </Typography>
                    </Box>
                </Box>

                {/* Content Below Box */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 'fit-content', margin: 2 }}>

                    {/* Support Tiers Title */}
                    <Typography variant="h6">
                        Support Tiers
                    </Typography>

                    {/* Scrollable box */}
                    <Paper sx={{ display: 'flex', width: "700px", gap: 2, overflowX: 'auto' }}>
                        {/* List of cards */}
                        {support_tier_rows()}
                    </Paper>

                    {/* Similar Petitions Title */}
                    <Typography variant="h6">
                        Similar Petitions
                    </Typography>

                    {/* Scrollable box */}
                    <Paper sx={{ display: 'flex', width: "700px", gap: 2, overflowX: 'auto' }}>
                        {/* List of cards */}
                        {petition_rows()}
                    </Paper>
                </Box>
            </Paper>
        </>
    )
}

// Petition Interface
interface ISupportTierProps {
    supportTier: SupportTier;
}

const SupportTierCard = (props: ISupportTierProps) => {

    // Get Support Tier
    const { supportTier } = props;

    return (
        <Card >
            <Typography gutterBottom variant="h5" component="div">
                {supportTier.title}
            </Typography>

            <Chip icon={<AttachMoneyIcon />} variant="outlined" label={supportTier?.cost}/>

            {/* Description Body */}
            <Typography variant="body2" maxWidth={300}>
                {supportTier?.description}
            </Typography>
        </Card>
    )
}

export default PetitionDetail;