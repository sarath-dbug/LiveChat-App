import React, { useState } from 'react'
import { Alert, IconButton, Snackbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';


function Toaster({ message }) {
  const [open, setOpen] = useState(true);
  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  }

  const color = message === "Updated User Profile" ? "success" : "warning";


  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        variant={color}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={message}
        action={[
          <IconButton
            key="close"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        ]}
      >

        <Alert
          onClose={handleClose}
          severity={color}
          sx={{ width: '30vw' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Toaster;
