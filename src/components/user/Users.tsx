import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {
    Alert, AlertTitle,
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Snackbar,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CSS from 'csstype';
import {useUserStore} from "../../store";

const card: CSS.Properties = {
    padding: "10px",
    margin: "20px",
}

interface HeadCell {
    id: string;
    label: string;
    align: "center" | "inherit" | "left" | "right" | "justify" | undefined;
}

const headCells: readonly HeadCell[] = [
    { id: 'ID', label: 'id', align: 'left' },
    { id: 'username', label: 'Username', align: 'right' },
    { id: 'link', label: 'Link', align: 'left' },
    { id: 'actions', label: 'Actions', align: 'left' }
];

const Users = () => {
    const navigate = useNavigate();
    // const [users, setUsers] = useState<Array<User>>([]);
    // const [editUserId, setEditUserId] = useState<number>();
    const [editUsername, setEditUsername] = useState<string>();
    const [deleteUserId, setDeleteUserId] = useState<number>();
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [dialogUser, setDialogUser] = React.useState<User>({ username: "", user_id: -1 });
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [username, setUsername] = useState<string>();
    const [openNewUserDialog, setOpenNewUserDialog] = React.useState(false);
    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const users = useUserStore(state => state.users)
    const setUsers = useUserStore(state => state.setUsers)

    const handleSnackClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };


    const getUsers = () => {
        axios.get('http://localhost:3000/api/users')
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("");
                setUsers(response.data);
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
    };

    useEffect(() => {
        getUsers();
    }, []);

    const list_of_users = () => {
        return users.map((item: User) =>
            <tr key={item.user_id}>
                <th scope="row">{item.user_id}</th>
                <td>{item.username}</td>
                <td><Link to={"/users/" + item.user_id}>Go to user</Link></td>
                <td>
                    <Button variant="outlined" color="error" endIcon={<DeleteIcon />} onClick={() => { handleDeleteDialogOpen(item) }}>Delete</Button>
                    <Button variant="outlined" endIcon={<EditIcon />} onClick={() => { handleEditDialogOpen(item) }}>Edit</Button>
                </td>
            </tr>
        );
    };

    const user_rows = () => {
        return users.map((row: User) =>
            <TableRow hover tabIndex={-1} key={row.user_id}>
                <TableCell align="left">{row.user_id}</TableCell>
                <TableCell align="right">{row.username}</TableCell>
                <TableCell align="left">
                    <Link to={"/users/" + row.user_id}>Go to user</Link>
                </TableCell>
                <TableCell align="left">
                    <Button variant="outlined" color="error" endIcon={<DeleteIcon />} onClick={() => { handleDeleteDialogOpen(row) }}>Delete</Button>
                    <Button variant="outlined" endIcon={<EditIcon />} onClick={() => { handleEditDialogOpen(row) }}>Edit</Button>
                </TableCell>
            </TableRow>
        );
    }

    const deleteUser = () => {
        axios.delete('http://localhost:3000/api/users/' + dialogUser.user_id)
            .then((response) => {
                handleDeleteDialogClose();
                setSnackMessage("User deleted successfully")
                setSnackOpen(true)
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

    const editUser = () => {
        axios.put('http://localhost:3000/api/users/' + dialogUser.user_id, { username: editUsername })
            .then((response) => {
                handleEditDialogClose()
                setSnackMessage("Username changed successfully")
                setSnackOpen(true)
            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
    }

    const handleEditDialogOpen = (user: User) => {
        setDialogUser(user);
        setOpenEditDialog(true);
    };

    const handleEditDialogClose = () => {
        setDialogUser({ username: "", user_id: -1 });
        setOpenEditDialog(false);
    };

    const newUser = () => {
        axios.post('http://localhost:3000/api/users', { username: username })
            .then((response) => {
                handleNewUserDialogClose()
                setSnackMessage("User added successfully")
                setSnackOpen(true)
            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
    }

    const handleNewUserDialogOpen = () => {
        setOpenNewUserDialog(true);
    };

    const handleNewUserDialogClose = () => {
        setOpenNewUserDialog(false);
    };

        return (
            <div>
                {errorFlag &&
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>
                }

                <Paper elevation={3} style={card}>
                    <h1>Users</h1>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {headCells.map((headCell) => (
                                        <TableCell
                                            key={headCell.id}
                                            align={headCell.align}
                                            padding={'normal'}>
                                            {headCell.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {user_rows()}
                                <Button variant="outlined" onClick={() => { handleNewUserDialogOpen() }}>New User</Button>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

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

                <Dialog open={openEditDialog} onClose={handleEditDialogClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{"Edit User?"}</DialogTitle>
                    <DialogContent>
                        <TextField id="outlined-basic" label="Username" variant="outlined" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditDialogClose}>Cancel</Button>
                        <Button variant="outlined" onClick={() => editUser()} autoFocus>Edit</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openNewUserDialog} onClose={handleNewUserDialogClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{"New User?"}</DialogTitle>
                    <DialogContent>
                        <TextField id="outlined-basic" label="Username" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleNewUserDialogClose}>Cancel</Button>
                        <Button variant="outlined" onClick={() => newUser()} autoFocus>Submit</Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    autoHideDuration={6000}
                    open={snackOpen}
                    onClose={handleSnackClose}
                    key={snackMessage}>
                    <Alert onClose={handleSnackClose} severity="success" sx={{ width: '100%' }}>
                        {snackMessage}
                    </Alert>
                </Snackbar>
            </div>
        );
};

export default Users;
