import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../Images/comments_512px.png";
import { Backdrop, CircularProgress, Button, TextField } from '@mui/material';
import axios from 'axios';
import Toaster from './Toaster';

function Login() {

    const [data, setData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [loginStatus, setLogingStatus] = useState("");
    console.log(loginStatus);

    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const navigator = useNavigate()

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
                <div className="image-container">
                    <img src={logo} alt="Logo" className='welcome-logo' />
                </div>
                <div className="login-box">
                    <p className='login-text'>Login to your Account</p>
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
                    <p>Don't have an Account ? <Link className="hyper" to="/signup">Sign Up</Link></p>
                    {loginStatus ? (
                        <Toaster key={loginStatus.key} message={loginStatus.msg} />
                    ) : null}
                </div>
            </div>
        </>
    );
}

export default Login;
