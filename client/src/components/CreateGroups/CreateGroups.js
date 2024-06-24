import React, { useState } from 'react'
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { useSelector } from 'react-redux'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton
} from '@mui/material'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function CreateGroups() {

  const lightTheme = useSelector((state) => state.themeKey);
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const nav = useNavigate()
  if (!userData) {
    nav("/");
  }
  const user = userData.data;
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleOpen = () => {
    setOpen(true);
  };

  const createGroup = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    };
    axios.post(
      "http://localhost:8080/chat/createGroup",
      {
        groupName: groupName,
        userId: user._id,
      },
      config
    );
    nav("/app/groups");
  }


  return (
    <>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Do you want to create a Group Named : "${groupName}"`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This will create a create group in which you will be the admin and
              other will be able to join this group.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button
              onClick={() => {
                createGroup();
                handleClose();
              }}
              autoFocus
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <div className={'createGroups-container' + (lightTheme ? "" : " dark ")}>
        <input
          type="text"
          placeholder='Enter Gruop Name'
          className={'search-box' + (lightTheme ? "" : " dark ")}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <IconButton
          className={'icon' + (lightTheme ? "" : " dark ")}
          onClick={() => handleOpen()}
        >
          <DoneOutlineIcon />
        </IconButton>
      </div>
    </>
  );
}

export default CreateGroups
