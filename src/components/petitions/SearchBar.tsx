import * as React from "react";
import axios from "axios";
import { SelectChangeEvent } from '@mui/material/Select';
import {
    Box,
    Button,
    Drawer,
    List,
    ListItem,
    Slider,
    TextField,
    Toolbar,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    OutlinedInput,
    Chip
} from "@mui/material";

// Petition Interface
interface ISearchProps {
    setPetitionSearch:  React.Dispatch<React.SetStateAction<PetitionSearch>>
}

// Global Variables
const INITIAL_PRICE = 50;
const MAX_PRICE = 100;
const MIN_PRICE = 0;
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

// Sort options and string values
const sortOptions = [
    {
        value: "ALPHABETICAL_ASC",
        label: "Alphabetical (A-Z)",
    },
    {
        value: "ALPHABETICAL_DESC",
        label: "Alphabetical (Z-A)",
    },
    {
        value: "COST_ASC",
        label: "Cost (Low to High)",
    },
    {
        value: "COST_DESC",
        label: "Cost (High to Low)",
    },
    {
        value: "CREATED_ASC",
        label: "Date Created (Oldest First)",
    },
    {
        value: "CREATED_DESC",
        label: "Date Created (Newest First)",
    },
];

// Price values
const marks = [
    {
        value: MIN_PRICE,
        label: '',
    },
    {
        value: MAX_PRICE,
        label: '',
    },
];

const SearchBar = (props: ISearchProps) => {

    // Get set search
    const { setPetitionSearch } = props;

    // Form variables
    const [search, setSearch] = React.useState('')
    const [categoriesSelectedIds, setCategoriesSelectedIds] = React.useState<string[]>([]);
    const [price, setPrice] = React.useState(INITIAL_PRICE);
    const [sortOptionSelected, setSortOptionSelected] = React.useState('CREATED_ASC')

    // Categories
    const [categories, setCategories] = React.useState<Category[] | null>(null);

    // Error flags
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

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

    // Handles search change
    const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value)
    }

    // Handles category change
    const handleChangeCategories = (event: SelectChangeEvent<typeof categoriesSelectedIds>) => {
        const {
            target: {value},
        } = event;

        setCategoriesSelectedIds(
            typeof value === 'string' ? value.split(',') : value
        );
    };

    // Handles price change
    const handleChangePrice = (event: Event, newPrice: number | number[]) => {
        setPrice(newPrice as number);
    };

    // Handles sort by change
    const handleChangeSortBy = (event: SelectChangeEvent) => {
        setSortOptionSelected(event.target.value as string);
    };

    // Handles submit
    const handleSubmit = () => {
        setPetitionSearch({
            startIndex:0,
            q: search || undefined,
            categoryIds: categoriesSelectedIds.length > 0 ? categoriesSelectedIds.map(Number): undefined,
            supportingCost: price !== 100 ? price + 1: undefined,
            sortBy: sortOptionSelected
        });
    }

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 300,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: 300, boxSizing: 'border-box' },
            }}>

            <Toolbar />

            <Box sx={{ overflow: 'auto' }}>
                <List>

                    {/* Search Title */}
                    <ListItem>
                        <Typography variant="h5">
                            Search
                        </Typography>
                    </ListItem>

                    {/* Search Box */}
                    <ListItem>
                        <TextField
                            id="outlined-basic"
                            label="Title or Description"
                            variant="outlined"
                            onChange={handleChangeSearch}
                            fullWidth/>
                    </ListItem>

                    {/* Categories */}
                    <ListItem>
                        <FormControl fullWidth>
                            <InputLabel id="categories-label">Categories</InputLabel>
                            <Select
                                labelId="categories-label"
                                id="select-categories"
                                multiple
                                value={categoriesSelectedIds}
                                label="Categories"
                                onChange={handleChangeCategories}
                                input={<OutlinedInput id="select-categories" label="Chip" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((categoryId) => (
                                            <Chip key={categoryId}
                                                  label={categories?.find(cat => cat.categoryId.toString() === categoryId)?.name || "Category Not Found"}/>
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}>

                                {categories?.map((category) => (
                                    <MenuItem key={category.categoryId} value={category.categoryId.toString()} >
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </ListItem>

                    {/* Supporting Cost */}
                    <ListItem>

                        {/* Slider & Label Box */}
                        <Box sx={{ width: 250 }}>

                            {/* Label */}
                            <Typography id="non-linear-slider" gutterBottom>
                                Supporting Cost:
                            </Typography>

                            {/* Slider */}
                            <Slider
                                defaultValue={INITIAL_PRICE}
                                max={100}
                                aria-label="Default"
                                value={price}
                                valueLabelDisplay="auto"
                                marks={marks}
                                onChange={handleChangePrice}
                            />

                            {/* Label Boxes */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography
                                    variant="body2"
                                    onClick={() => setPrice(MIN_PRICE)}
                                    sx={{ cursor: 'pointer' }}>
                                    Free
                                </Typography>
                                <Typography
                                    variant="body2"
                                    onClick={() => setPrice(MAX_PRICE)}
                                    sx={{ cursor: 'pointer' }}>
                                    All
                                </Typography>
                            </Box>
                        </Box>
                    </ListItem>

                    {/* Sort Options */}
                    <ListItem>
                        <FormControl fullWidth>
                            <InputLabel id="sortBy-label">Sort Options</InputLabel>
                            <Select
                                labelId="sortBy-label"
                                id="select-sortBy"
                                value={sortOptionSelected}
                                label="Sort Options"
                                onChange={handleChangeSortBy}>

                                {sortOptions.map((sortOption) => (
                                    <MenuItem key={sortOption.value} value={sortOption.value} >
                                        {sortOption.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </ListItem>

                    {/* Submit Button */}
                    <ListItem>
                        <Button variant="contained" onClick={handleSubmit}>Submit</Button>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    )
}

export default SearchBar;