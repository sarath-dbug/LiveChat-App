import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Login.css"
import logo from "../../assets/icons/comments_512px.png";
import { Backdrop, CircularProgress, Button, TextField } from '@mui/material';
import axios from 'axios';
import Toaster from '../Toaster/Toaster';
import { useGoogleLogin } from '@react-oauth/google';
import GoogleIcon from "../../assets/icons/google.png";

function Login() {

    const [data, setData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [loginStatus, setLogingStatus] = useState("");
    const navigator = useNavigate()
   
    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }


    const login = useGoogleLogin({
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
                    password: "Google0auth*",
                };
                googleloginUpHandler(googleData);
            } catch (error) {
                console.log(error);
            }
        }
    });


    const googleloginUpHandler = async (googleData) => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const response = await axios.post(
                "http://localhost:8080/user/login/",
                googleData,
                config
            );
            setLogingStatus({ msg: "Success", key: Math.random() });
            navigator("/app/welcome");
            sessionStorage.setItem("userData", JSON.stringify(response));
            setLoading(false);

        } catch (error) {
            setLogingStatus({ msg: "Invalid User name or Password", key: Math.random() });
            setLoading(false);
        }
    };


    const loginHandler = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const response = await axios.post(
                "http://localhost:8080/user/login/",
                data,
                config
            );
            setLogingStatus({ msg: "Success", key: Math.random() });
            navigator("/app/welcome");
            sessionStorage.setItem("userData", JSON.stringify(response));
            setLoading(false);

        } catch (error) {
            setLogingStatus({ msg: "Invalid User name or Password", key: Math.random() });
            setLoading(false);
        }
    }

    return (
        <>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="secondary" />
            </Backdrop>
            <div className='login-container'>
                <div className="login-image-container">
                    <img src={logo} alt="Logo" className='login-welcome-logo' />
                </div>
                <div className="login-box">
                    <p className='login-text'>Login</p>
                    <TextField
                        onChange={changeHandler}
                        id="standard-basic"
                        label="Enter User Name"
                        variant="outlined"
                        name="name"
                        onKeyDown={(event) => {
                            if (event.code === "Enter") {
                                // console.log(event);
                                loginHandler();
                            }
                        }}
                    />
                    <TextField
                        onChange={changeHandler}
                        id="outlined-password-input"
                        label="Password"
                        type='password'
                        autoComplete="current-password"
                        name="password"
                        onKeyDown={(event) => {
                            if (event.code === "Enter") {
                                // console.log(event);
                                loginHandler();
                            }
                        }}
                    />
                    
                    <Button
                        onClick={loginHandler}
                        variant="outlined">
                        Login
                    </Button>
                    <Button
                        onClick={() => login()}
                        variant="outlined"
                        className="google-button"
                        style={{ textTransform: 'none' }}
                    >
                        <img src={GoogleIcon} alt="Logo" className="google-icon" />
                        Sign in with Google
                    </Button>
                    <p>Don't have an Account ? <Link className="login-hyper" to="/signup">Sign Up</Link></p>
                    {loginStatus ? (
                        <Toaster key={loginStatus.key} message={loginStatus.msg} />
                    ) : null}
                </div>
            </div>
        </>
    );
}

export default Login;
