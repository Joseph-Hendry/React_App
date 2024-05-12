import * as React from 'react';
import Box from '@mui/material/Box';
import axios from "axios";
import CSS from 'csstype';
import {
    Card,
    CardContent,
    CardMedia,
    Typography} from '@mui/material';
import {usePetitionStore} from "../../store";

// Petition Interface
interface IPetitionProps {
    petition: Petition;
}

// Card CSS
const card: CSS.Properties = {
    display: "inline-block",
    height: "450px",
    width: "300px",
    margin: "10px",
    padding: "00px"
};

// Card Content CSS
const cardContent: CSS.Properties = {
    textAlign: "left",
    display: 'flex',
    flexDirection: 'column'
};

const PetitionCard = (props: IPetitionProps) => {

    // Error flags
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    // Petition and photo
    const { petition } = props;
    const [petitionImageURL, setPetitionImageURL] = React.useState("https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png");

    // Categories
    const categories = usePetitionStore((state) => state.categories);
    const [categoryName, setCategoryName] = React.useState("");

    // Gets the image
    React.useEffect(() => {
        const getPetitionsImg = () => {
            axios.get(`http://localhost:3000/api/v1/petitions/${petition.petitionId}/image`, {responseType: "blob"})
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setPetitionImageURL(URL.createObjectURL(response.data));
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };
        getPetitionsImg();
    }, [petition.petitionId]);


    // Get the category
    React.useEffect(() => {
        const getPetitionsCategory = () => {
            if (categories && categories.length > 0) {
                const category = categories.find((category) => category.categoryId === petition.categoryId);
                if (category) {
                    setCategoryName(category.name);
                }
            }
        };
        getPetitionsCategory();
    }, [categories, petition.categoryId]);


    // Format the date
    const formattedDate: string = new Date(petition.creationDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
    });

    return (
        <Card sx={card}>

            {/* Hero Image */}
            <CardMedia
                component="img"
                height="300"
                width="300"
                image={petitionImageURL}
                alt="Auction hero"
            />

            {/* Contents */}
            <CardContent sx={cardContent}>

                {/* Title */}
                <Typography variant="h6">
                    {petition.title}
                </Typography>

                {/* Owner */}
                <Typography variant="subtitle1" color="text.secondary">
                    {petition.ownerFirstName + " " + petition.ownerLastName}
                </Typography>

                {/* Category */}
                <Typography variant="body2" color="text.secondary">
                    {categoryName}
                </Typography>

                {/* Box at the bottom */}
                <Box flex={"none"} display="flex" justifyContent="space-between" >

                    {/* Supporting Cost */}
                    <Typography variant="body2" color="text.secondary">
                        {petition.supportingCost === 0 ? 'Free' : `$${petition.supportingCost}`}
                    </Typography>

                    {/* Creation Date */}
                    <Typography variant="body2" color="text.secondary">
                        {formattedDate}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}

export default PetitionCard;