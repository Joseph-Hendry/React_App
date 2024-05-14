import {
    Box, Button,
    Divider, Drawer,
    List,
    ListItem, Slider,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Toolbar,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    OutlinedInput,
    Chip
} from "@mui/material";
import * as React from "react";
import {usePetitionStore} from "../../store";
import { SelectChangeEvent } from '@mui/material/Select';
import { Theme, useTheme } from '@mui/material/styles';

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

function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const marks = [
    {
        value: 0,
        label: '0',
    },
    {
        value: 100,
        label: '100',
    },
];

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

function valuetext(value: number) {
    return `${value}`;
}

const SearchBar = () => {

    // Get stored varibles
    const categories = usePetitionStore((state) => state.categories);

    const [sortOptionSelected, setSortOptionSelected] = React.useState('ALPHABETICAL_ASC')

    const [categoriesSelectedIds, setCategoriesSelectedIds] = React.useState<string[]>([]);
    const theme = useTheme();

    const handleChangeSortBy = (event: SelectChangeEvent) => {
        setSortOptionSelected(event.target.value as string);
    };

    const handleChangeCategories = (event: SelectChangeEvent<typeof categoriesSelectedIds>) => {
        const {
            target: {value},
        } = event;

        setCategoriesSelectedIds(
            typeof value === 'string' ? value.split(',') : value
        );
    };

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
                        <TextField id="outlined-basic" label="Title or Description" variant="outlined" fullWidth/>
                    </ListItem>

                    <Divider/>

                    {/* Filter Title */}
                    <ListItem>
                        <Typography variant="h5">
                            Filter
                        </Typography>
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
                                                  label={categories.find(cat => cat.categoryId.toString() === categoryId)?.name || "Category Not Found"}/>
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}>

                                {categories.map((category, index) => (
                                    <MenuItem key={category.categoryId} value={category.categoryId.toString()} >
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </ListItem>

                    {/* Supporting Cost */}
                    <ListItem>
                        <Slider
                            aria-label="Restricted values"
                            defaultValue={20}
                            getAriaValueText={valuetext}
                            step={null}
                            valueLabelDisplay="auto"
                            marks={marks}/>
                    </ListItem>

                    <Divider/>

                    {/* Sort Title */}
                    <ListItem>
                        <Typography variant="h5">
                            Sort
                        </Typography>
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

                                {/* None Item */}
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>

                                {sortOptions.map((sortOption, index) => (
                                    <MenuItem key={sortOption.value} value={sortOption.value} >
                                        {sortOption.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </ListItem>

                    <Divider/>

                    {/* Submit Button */}
                    <ListItem>
                        <Button variant="contained">Submit</Button>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    )
}

export default SearchBar;