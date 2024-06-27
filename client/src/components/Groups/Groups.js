import React, { useEffect, useState } from 'react';
import './Groups.css';
import logo from "../../assets/icons/comments_512px.png";
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from "@mui/icons-material/Refresh";
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { refreshSidebarFun } from '../../features/refreshSidebar';
import axios from 'axios';

function Groups() {
    const lightTheme = useSelector((state) => state.themeKey);
    const refresh = useSelector((state) => state.refreshKey);
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [groups, setGroups] = useState([]);

    if (!userData) {
        navigate("/");
    }

    const user = userData.data;

    useEffect(() => {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        };

        axios.get(
            "http://localhost:8080/chat/fetchGroups",
            config
        ).then((response) => setGroups(response.data))
            .catch((error) => console.error("Error fetching groups:", error));
    }, [refresh, user.token]);

    const handleGroupClick = (groupId) => {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        };

        axios.put(
            "http://localhost:8080/chat/addNewUserExitedGroup",
            {
                groupId: groupId,
                userId: user._id,
            },
            config
        ).then(() => {
            dispatch(refreshSidebarFun());
        }).catch((error) => console.error("Error adding user to group:", error));
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
                className='group-list-container'>
                <div className={"group-ug-header" + (lightTheme ? "" : " dark ")}>
                    <img src={logo}
                        style={{ height: "2rem", width: "2rem", marginLeft: "10px" }}
                    />
                    <p className={"group-ug-title" + (lightTheme ? "" : " dark ")}>Available Groups</p>
                    <IconButton
                        className={"group-icon" + (lightTheme ? "" : " dark")}
                        onClick={() => {
                            dispatch(refreshSidebarFun());
                        }}
                    >
                        <RefreshIcon />
                    </IconButton>
                </div>

                <div className={"group-sb-search" + (lightTheme ? "" : " dark ")}>
                    <IconButton>
                        <SearchIcon className={"group-icon" + (lightTheme ? "" : " dark ")} />
                    </IconButton>
                    <input type="text" placeholder='Search' className={"group-search-box" + (lightTheme ? "" : " dark ")} />
                </div>

                <div className="group-ug-list">
                    {groups.map((group, index) => (
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className={"group-list-item" + (lightTheme ? "" : " dark ")}
                            key={index}
                            onClick={() => handleGroupClick(group._id)}
                        >
                            <p className="group-con-icon">{group.chatName[0]}</p>
                            <p className={"group-con-title" + (lightTheme ? "" : " dark ")}>{group.chatName}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

export default Groups;
