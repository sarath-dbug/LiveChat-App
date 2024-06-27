import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Login.css"
import logo from "../../assets/icons/comments_512px.png";
import { Backdrop, CircularProgress, Button, TextField } from '@mui/material';
import axios from 'axios';
import Toaster from '../Toaster/Toaster';

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
                <div className="login-image-container">
                    <img src={logo} alt="Logo" className='login-welcome-logo' />
                </div>
                <div className="login-box">
                    <p className='login-text'>Login</p>
                    <TextField
                        onChange={changeHandler}
                        id="standard-basic"
                        color="secondary" focused
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
                        color="secondary" focused
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
