import React, { useEffect, useState } from 'react';
import './Users.css';
import logo from "../../assets/images/comments_512px.png";
import { IconButton } from '@mui/material';
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from "framer-motion";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { refreshSidebarFun } from '../../features/refreshSidebar';

function Users() {
    const lightTheme = useSelector((state) => state.themeKey);
    const refresh = useSelector((state) => state.refreshKey);
    const [users, setUsers] = useState([]);
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    const dispatch = useDispatch();
    const nav = useNavigate();

    if (!userData) {
        nav(-1);
    }

    useEffect(() => {
        const config = {
            headers: {
                Authorization: `Bearer ${userData.data.token}`
            }
        };

        axios.get("http://localhost:8080/user/fetchUsers", config)
            .then((data) => setUsers(data.data))
            .catch((error) => console.error("Error fetching users:", error));
    }, [refresh, userData]);

    const handleUserClick = (userId) => {
        const config = {
            headers: {
                Authorization: `Bearer ${userData.data.token}`
            }
        };
        axios.post("http://localhost:8080/chat", { userId }, config)
            .then(() => {
                dispatch(refreshSidebarFun());
            })
            .catch((error) => console.error("Error creating chat:", error));
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                    ease: "anticipate",
                    duration: "0.3"
                }}
                className='user-list-container'>
                <div className={"user-ug-header" + (lightTheme ? "" : " dark ")}>
                    <img src={logo}
                        style={{ height: "2rem", width: "2rem", marginLeft: "10px" }}
                    />
                    <p className={"user-ug-title" + (lightTheme ? "" : " dark ")}>Available Users</p>
                    <IconButton
                        onClick={() => dispatch(refreshSidebarFun())}
                        className={"user-icon" + (lightTheme ? "" : " dark")}
                    >
                        <RefreshIcon />
                    </IconButton>
                </div>
                <div className={"user-sb-search" + (lightTheme ? "" : " dark ")}>
                    <IconButton>
                        <SearchIcon className={"user-icon" + (lightTheme ? "" : " dark ")} />
                    </IconButton>
                    <input type="text" placeholder='Search' className={"user-search-box" + (lightTheme ? "" : " dark ")} />
                </div>
                <div className="user-ug-list">
                    {users.map((user, index) => (
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className={"user-list-item" + (lightTheme ? "" : " dark ")}
                            key={index}
                            onClick={() => handleUserClick(user._id)}
                        >
                            <p className="user-con-icon">{user.name[0]}</p>
                            <p className={"user-con-title" + (lightTheme ? "" : " dark ")}>{user.name}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

export default Users;
