import React, { useState } from 'react';
import "./Signup.css"
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../assets/icons/comments_512px.png";
import { Backdrop, CircularProgress, Button, TextField } from '@mui/material';
import axios from 'axios';
import Toaster from '../Toaster/Toaster';
import { useGoogleLogin } from '@react-oauth/google';
import GoogleIcon from "../../assets/icons/google.png";


function Signup() {

    const [data, setData] = useState({ name: "", email: "", mobile: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigator = useNavigate();
    const [signupStatus, setSignupStatus] = useState("");

    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const sign = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                const res = await axios.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    {
                        headers: {
                            Authorization: `Bearer ${response.access_token}`
                        },
                    }
                );
                const googleData = {
                    name: res.data.name,
                    email: res.data.email,
                    mobile: "0123456789",
                    password: "Google0auth*",
                    googleSign: true
                };
                googleSignUpHandler(googleData);
            } catch (error) {
                console.log(error);
            }
        }
    });

    const googleSignUpHandler = async (googleData) => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const response = await axios.post(
                "http://localhost:8080/user/register/",
                googleData,
                config
            );
            setSignupStatus({ msg: "Success", key: Math.random() });
            navigator("/app/welcome");
            sessionStorage.setItem("userData", JSON.stringify(response));
            setLoading(false);

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

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
            if (error.response) {
                const { status, data } = error.response;

                if (status === 400) {
                    setSignupStatus({ msg: data.message, key: Math.random() });
                }

                if (status === 409 && data.message.includes("email")) {
                    setSignupStatus({ msg: "User with this email ID already exists", key: Math.random() });
                }

                if (status === 409 && data.message.includes("Username")) {
                    setSignupStatus({ msg: "Username already taken, please choose another one", key: Math.random() });
                }
            } else {
                setSignupStatus({ msg: "An unknown error occurred", key: Math.random() });
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
                    <img
                        src={logo}
                        alt="Logo"
                        className='signup-welcome-logo'
                    />
                </div>
                <div className="signup-box">
                    <p className='signup-text'>Create an Account</p>
                    <TextField
                        onChange={changeHandler}
                        id="standard-basic"
                        label="Enter User Name"
                        name="name"
                        variant="outlined"
                        onKeyDown={(event) => {
                            if (event.code === "Enter") {
                                signUpHandler();
                            }
                        }}
                    />
                    <TextField
                        onChange={changeHandler}
                        id="outlined-email-input"
                        label="Email"
                        type='email'
                        autoComplete="email"
                        name="email"
                        variant="outlined"
                        onKeyDown={(event) => {
                            if (event.code === "Enter") {
                                signUpHandler();
                            }
                        }}
                    />
                    <TextField
                        onChange={changeHandler}
                        id="outlined-mobile-input"
                        label="Mobile"
                        type='mobile'
                        autoComplete="mobile"
                        name="mobile"
                        variant="outlined"
                        onKeyDown={(event) => {
                            if (event.code === "Enter") {
                                signUpHandler();
                            }
                        }}
                    />
                    <TextField
                        onChange={changeHandler}
                        id="outlined-password-input"
                        label="Password"
                        type='password'
                        autoComplete="new-password"
                        name="password"
                        variant="outlined"
                        onKeyDown={(event) => {
                            if (event.code === "Enter") {
                                signUpHandler();
                            }
                        }}
                    />

                    <Button
                        onClick={signUpHandler}
                        variant="outlined">
                        Sign Up
                    </Button>

                    <Button
                        onClick={() => sign()}
                        variant="outlined"
                        className="google-button"
                        style={{ textTransform: 'none' }}
                    >
                        <img src={GoogleIcon} alt="Logo" className="google-icon" />
                        Sign up with Google
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
