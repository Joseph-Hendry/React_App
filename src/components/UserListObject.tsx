import React from "react";
import axios from "axios";
import { Delete, Edit } from "@mui/icons-material";
import { useUserStore } from "../store";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    TextField,
    Typography
} from "@mui/material";
import CSS from 'csstype';

interface IUserProps {
    user: User;
}

const UserListObject = (props: IUserProps) => {
    const { user } = props;
    const deleteUserFromStore = useUserStore(state => state.removeUser);
    const editUserFromStore = useUserStore(state => state.editUser);

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [username, setUsername] = React.useState("");

    const handleDeleteDialogClose = () => {
        setOpenDeleteDialog(false);
    };

    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
    };

    const deleteUser = () => {
        axios.delete(`http://localhost:3000/api/users/${user.user_id}`)
            .then(() => {
                deleteUserFromStore(user);
                handleDeleteDialogClose();
            });
    };

    const editUser = () => {
        axios.put(`http://localhost:3000/api/users/${user.user_id}`, { "username": username })
            .then(() => {
                editUserFromStore(user, username);
                handleEditDialogClose();
            });
    };

    const userCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "328px",
        width: "300px",
        margin: "10px",
        padding: "0px"
    };

    return (
        <Card sx={userCardStyles}>
            <CardMedia
                component="img"
                height="200"
                width="200"
                sx={{ objectFit: "cover" }}
                image="https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png"
                alt="Auction hero"
            />
            <CardContent>
                <Typography variant="h4">
                    {user.user_id} {user.username}
                </Typography>
            </CardContent>
            <CardActions>
                <IconButton onClick={() => { setOpenEditDialog(true) }}>
                    <Edit />
                </IconButton>
                <IconButton onClick={() => { setOpenDeleteDialog(true) }}>
                    <Delete />
                </IconButton>
            </CardActions>

            <Dialog open={openEditDialog} onClose={handleEditDialogClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"Edit User?"}</DialogTitle>
                <DialogContent>
                    <TextField id="outlined-basic" label="Username" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditDialogClose}>Cancel</Button>
                    <Button variant="outlined" onClick={() => editUser()} autoFocus>Edit</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"Delete User?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">Are you sure you want to delete this user?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                    <Button variant="outlined" color="error" onClick={() => deleteUser()} autoFocus>Delete</Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default UserListObject;