import {Link, useNavigate, useParams} from "react-router-dom";
import React from "react";
import axios from "axios";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const User = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [user, setUser] = React.useState<User>({user_id:0, username:""});
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [dialogUser, setDialogUser] = React.useState<User>({ username: "", user_id: -1 });

    React.useEffect(() => {
        const getUser = () => {
            axios.get('http://localhost:4941/api/v1/users/'+id)
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setUser(response.data);
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };
        getUser();
    }, [id]);

    const deleteUser = () => {
        axios.delete('http://localhost:3000/api/users/' + user.user_id)
            .then((response) => {
                navigate('/users');
            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
    }

    const handleDeleteDialogOpen = (user: User) => {
        setDialogUser(user);
        setOpenDeleteDialog(true);
    };

    const handleDeleteDialogClose = () => {
        setDialogUser({ username: "", user_id: -1 });
        setOpenDeleteDialog(false);
    };

    if (errorFlag) {
        return (
            <div>
                <h1>User</h1>
                <div style={{ color: "red" }}>
                    {errorMessage}
                </div>
                <Link to={"/users"}>Back to users</Link>
            </div>
        );
    } else {
        return (
            <div>
                <h1>User</h1>
                {user.user_id}: {user.username}
                <Link to={"/users"}>Back to users</Link>
                <button type="button">Edit</button>
                <Button variant="outlined" endIcon={<DeleteIcon />} onClick={() => { handleDeleteDialogOpen(user) }}>Delete</Button>

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
            </div>
        );
    }
}

export default User;