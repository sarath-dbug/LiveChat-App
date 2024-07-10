import React, { useState, useEffect } from 'react';
import "./Profile.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Backdrop, CircularProgress, Button, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import personImage from "../../assets/images/person.png";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import Toaster from '../Toaster/Toaster';


const Profile = () => {

  const [selectedFile, setSelectedFile] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [data, setData] = useState({ name: "", email: "", mobile: "" });
  const [loading, setLoading] = useState(false);
  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  }
  const [updateStatus, setUpdateStatus] = useState("");




  const nav = useNavigate();
  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    if (!userData) {
      nav("/");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`
      }
    };

    axios.get("http://localhost:8080/user/fetchUserProfile", config)
      .then((response) => {
        setUserProfile(response.data);
        sessionStorage.setItem("userProfile", JSON.stringify(response.data));
      })
      .catch((error) => console.error("Error fetching user profile:", error));
  }, [nav]);

  const userData = JSON.parse(sessionStorage.getItem("userData"));
  if (!userData) {
    return null; // Exit early if userData is not available
  }



  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };


  const userId = userData.data._id;

  const handleUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('userId', userId);

    try {
      const response = await axios.post("http://localhost:8080/user/upload", formData);
      setUpdateStatus({ msg: "Updated User Profile", key: Math.random() })
      // Assuming response contains updated user profile
      setUserProfile(response.data);
      sessionStorage.setItem("userProfile", JSON.stringify(response.data));
      setSelectedFile(null);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };



  const saveHandler = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const response = await axios.post(
        "http://localhost:8080/user/editUserProfile/",
        { ...data, userId },
        config
      );
      setUpdateStatus({ msg: "Success", key: Math.random() })

      // Retrieve the existing userData from session storage
      const existingUserData = JSON.parse(sessionStorage.getItem("userData"));
      // Update the userData with the new data
      const updatedUserData = {
        ...existingUserData,
        data: {
          ...existingUserData.data,
          ...response.data,
        },
      };
      // Save the updated userData back to session storage
      sessionStorage.setItem("userData", JSON.stringify(updatedUserData));
      // Update the userProfile state with the new data
      setUserProfile(response.data);
      setOpen(false);
      setLoading(false);
    } catch (error) {
      console.log(error.response.status);
      setLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <div className="profile-container">
        <div className="profile-box">
          <div className="profile-controls">
            <div className="profile-image-box">
              <img
                src={userProfile && userProfile.image ? `http://localhost:8080/Images/${userProfile.image}` : personImage}
                alt=""
                className='profile-image'
              />
              <input type="file" id="file-input" onChange={handleFileChange} style={{ display: 'none' }} />
              <label htmlFor="file-input">
                <Button
                  component="span"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  className="upload-button"
                >
                  Upload File
                </Button>
              </label>
              {selectedFile && (
                <Typography variant="body1" component="p" className="file-selected-text">
                  File selected: {selectedFile.name}
                </Typography>
              )}
              <Button variant="contained" color="primary" onClick={handleUpload} disabled={!selectedFile}>
                Submit
              </Button>
            </div>
          </div>
          <div className="user-profile-list">
            <Typography variant="body1" component="div" className="profile-list-item">
              <span className="profile-list-label">Name:</span> {userProfile ? userProfile.name : userData.data.name}
            </Typography>
            <Typography variant="body1" component="div" className="profile-list-item">
              <span className="profile-list-label">Email:</span> {userProfile ? userProfile.email : userData.data.email}
            </Typography>
            <Typography variant="body1" component="div" className="profile-list-item">
              <span className="profile-list-label">Mobile:</span> {userProfile ? userProfile.mobile : userData.data.mobile}
            </Typography>
            <Typography variant="body1" component="div" className="profile-list-item">
              <span className="profile-list-label">Edit Info:</span>
              <Button onClick={handleClickOpen}>
                <EditNoteOutlinedIcon style={{ color: 'black', marginLeft: '-30px', fontSize: '32px' }} />
              </Button>
              <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                  component: 'form',
                }}
              >
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                  <TextField
                    onChange={changeHandler}
                    autoFocus
                    required
                    margin="dense"
                    id="name"
                    name="name"
                    label="name"
                    type="name"
                    fullWidth
                    variant="standard"
                  />
                  <TextField
                    onChange={changeHandler}
                    autoFocus
                    required
                    margin="dense"
                    id="email"
                    name="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                  />
                  <TextField
                    onChange={changeHandler}
                    autoFocus
                    required
                    margin="dense"
                    id="mobile"
                    name="mobile"
                    label="mobile number"
                    type="mobile"
                    fullWidth
                    variant="standard"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={saveHandler} type="submit">Save</Button>
                </DialogActions>

              </Dialog>
            </Typography>
            {updateStatus ? (
              <Toaster key={updateStatus.key} message={updateStatus.msg} />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
