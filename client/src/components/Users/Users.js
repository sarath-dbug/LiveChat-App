import React, { useEffect, useState } from 'react';
import './Users.css';
import logo from "../../assets/icons/comments_512px.png";
import { IconButton } from '@mui/material';
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from "framer-motion";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { refreshSidebarFun } from '../../features/refreshSidebar';
import personImage from '../../assets/images/person.png';
import Avatar from '@mui/material/Avatar';
import backendURL from '../../config/config';



function Users() {
    const lightTheme = useSelector((state) => state.themeKey);
    const refresh = useSelector((state) => state.refreshKey);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
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

        axios.get(`${backendURL}/user/fetchUsers`, config)
            .then((data) => setUsers(data.data))
            .catch((error) => console.error("Error fetching users:", error));
    }, [refresh, userData]);

    const handleUserClick = (userId) => {
        const config = {
            headers: {
                Authorization: `Bearer ${userData.data.token}`
            }
        };
        axios.post(`${backendURL}/chat`, { userId }, config)
            .then(() => {
                dispatch(refreshSidebarFun());
            })
            .catch((error) => console.error("Error creating chat:", error));
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );



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
                className='user-list-container'
            >

                <div className={"user-ug-header" + (lightTheme ? "" : " dark ")}>
                    <img src={logo}
                        style={{
                            height: "2rem",
                            width: "2rem",
                            marginLeft: "10px"
                        }}
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
                    <input
                        type="text"
                        placeholder='Search'
                        className={"user-search-box" + (lightTheme ? "" : " dark ")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="user-ug-list">
                    {filteredUsers.map((user, index) => (
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className={"user-list-item" + (lightTheme ? "" : " dark ")}
                            key={index}
                            onClick={() => handleUserClick(user._id)}
                        >
                            <Avatar
                                src={user && user.image ? `${backendURL}/Images/${user.image}` : personImage}
                                alt="Image"
                                sx={{
                                    width: 50,
                                    height: 50,
                                    marginLeft: 2,
                                    marginRight: 1
                                }}
                            />
                            <p className={"user-con-title" + (lightTheme ? "" : " dark ")}>{user.name}</p>
                        </motion.div>
                    ))}
                </div>

            </motion.div>
        </AnimatePresence>
    );
}

export default Users;
