import React, { useState } from 'react';
import "./Signup.css"
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../assets/icons/comments_512px.png";
import { Backdrop, CircularProgress, Button, TextField } from '@mui/material';
import axios from 'axios';
import Toaster from '../Toaster/Toaster';


function Signup() {

    const [data, setData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);


    const [signupStatus, setSignupStatus] = useState("");
    console.log(signupStatus);

    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const navigator = useNavigate();

    const signUpHandler = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const response = await axios.post(
                "http://localhost:8080/user/register/",
                data,
                config
            );
            setSignupStatus({ msg: "Success", key: Math.random() });
            navigator("/app/welcome");
            sessionStorage.setItem("userData", JSON.stringify(response));
            setLoading(false);

        } catch (error) {
            console.log(error.response.status);

            if (error.response.status === 405) {
                setSignupStatus({ msg: "User with this email ID already Exists", key: Math.random() });
            }
            if (error.response.status === 406) {
                setSignupStatus({ msg: "User Name already Taken, Please take another one", key: Math.random() });
            }
            setLoading(false);
        }
    };


    return (
        <>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="secondary" />
            </Backdrop>
            <div className='signup-container'>
                <div className="signup-image-container">
                    <img src={logo} alt="Logo" className='signup-welcome-logo' />
                </div>
                <div className="signup-box">
                    <p className='signup-text'>Create an Account</p>
                    <TextField
                        onChange={changeHandler}
                        id="standard-basic"
                        label="Enter User Name"
                        color="secondary" focused
                        name="name"
                        variant="outlined"
                        onKeyDown={(event) => {
                            if (event.code === "Enter") {
                                // console.log(event);
                                signUpHandler();
                            }
                        }}
                    />
                    <TextField
                        onChange={changeHandler}
                        id="outlined-email-input"
                        label="Email"
                        color="secondary" focused
                        type='email'
                        autoComplete="email"
                        name="email"
                        variant="outlined"
                        onKeyDown={(event) => {
                            if (event.code === "Enter") {
                                // console.log(event);
                                signUpHandler();
                            }
                        }}
                    />
                    <TextField
                        onChange={changeHandler}
                        id="outlined-password-input"
                        color="secondary" focused
                        label="Password"
                        type='password'
                        autoComplete="new-password"
                        name="password"
                        variant="outlined"
                        onKeyDown={(event) => {
                            if (event.code === "Enter") {
                                // console.log(event);
                                signUpHandler();
                            }
                        }}
                    />
                    
                    <Button
                        onClick={signUpHandler}
                        variant="outlined">
                        Sign Up
                    </Button>
                    <p>
                        Already have an Account ?
                        <Link className="signup-hyper" to="/">Login</Link>
                    </p>
                    {signupStatus ? (
                        <Toaster key={signupStatus.key} message={signupStatus.msg} />
                    ) : null}
                </div>
            </div>
        </>
    );
}

export default Signup;
