import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NightlightIcon from '@mui/icons-material/Nightlight';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LightModeIcon from '@mui/icons-material/LightMode';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../features/themeSlice';
import personImage5 from '../../assets/images/person5.jpg';
import personImage6 from '../../assets/images/person6.jpg';
import personImage7 from '../../assets/images/person7.jpg';
import axios from 'axios';

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lightTheme = useSelector((state) => state.themeKey);
  const refresh = useSelector((state) => state.refreshKey);
  const [conversations, setConversations] = useState([]);
  const userData = useMemo(() => JSON.parse(sessionStorage.getItem("userData")), []);

  useEffect(() => {
    if (!userData) {
      navigate("/");
      return;
    }

    const fetchConversations = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userData.data.token}`
          }
        };
        const response = await axios.get("http://localhost:8080/chat/", config);
        setConversations(response.data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, [refresh, userData, navigate]);

  if (!userData) {
    return null; // or a loading spinner or some placeholder content
  }

  return (
    <div className={"sb-container" + (lightTheme ? "" : " dark ")}>
      <div className={"sb-header" + (lightTheme ? "" : " dark ")}>
        <div className='sb-other-icons'>
          <IconButton onClick={() => navigate('/app/welcome')}>
            <HomeIcon className={"sb-icon" + (lightTheme ? "" : " dark ")} />
          </IconButton>
          <IconButton onClick={() => navigate('users')}>
            <PersonAddIcon className={"sb-icon" + (lightTheme ? "" : " dark ")} />
          </IconButton>
          <IconButton onClick={() => navigate('groups')}>
            <GroupAddIcon className={"sb-icon" + (lightTheme ? "" : " dark ")} />
          </IconButton>
          <IconButton onClick={() => navigate('create-groups')}>
            <AddCircleIcon className={"sb-icon" + (lightTheme ? "" : " dark ")} />
          </IconButton>
          <IconButton onClick={() => dispatch(toggleTheme())}>
            {lightTheme ? <NightlightIcon className={"sb-icon" + (lightTheme ? "" : " dark ")} /> : <LightModeIcon className={"icon" + (lightTheme ? "" : " dark ")} />}
          </IconButton>

          <IconButton onClick={() => {
            sessionStorage.removeItem("userData");
            navigate('/');
          }}>
            <ExitToAppIcon className={"sb-icon" + (lightTheme ? "" : " dark ")} />
          </IconButton>

          <IconButton onClick={() => navigate('/app/welcome')}>
            <Avatar className={"sb-icon" + (lightTheme ? "" : " dark ")} alt="Remy Sharp" src={personImage5} />
          </IconButton>
        </div>
      </div>

      <div className={"sb-search" + (lightTheme ? "" : " dark ")}>
        <IconButton>
          <SearchIcon className={"sb-icon" + (lightTheme ? "" : " dark ")} />
        </IconButton>
        <input type="text" placeholder='search' className={"sb-search-box" + (lightTheme ? "" : " dark ")} />
      </div>

      <div className={"sb-conversations" + (lightTheme ? "" : " dark ")}>
        {conversations.map((conversation, index) => {

          if (conversation.isGroupChat) {
            const latestMessageContent = conversation.latestMessage ? conversation.latestMessage.content : 'No previous Messages, click here to start a new chat';
            const timeStamp = conversation.latestMessage ? new Date(conversation.latestMessage.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";

            return (
              <div className={'sb-conversation-container' + (lightTheme ? "" : " dark ")}
                key={index}
                onClick={() => navigate(`chat/${conversation._id}&${conversation.chatName}`)}>
                {/* <p className='sb-con-icon'>{conversation.chatName[0]}</p> */}
                <Avatar alt="Image" src={personImage7} className='sb-con-icon'/>
                <p className={'sb-con-title' + (lightTheme ? "" : " dark ")}>{conversation.chatName}</p>
                <p className={"sb-con-lastMessage" + (lightTheme ? "" : " dark ")}>{latestMessageContent}</p>
                <p className={'sb-con-timeStamp' + (lightTheme ? "" : " dark ")}>{timeStamp}</p>
              </div>
            );
          } else {
            const otherUser = conversation.users.find(user => user._id !== userData.data._id);
            if (!otherUser) return null;

            const latestMessageContent = conversation.latestMessage ? conversation.latestMessage.content : 'No previous Messages, click here to start a new chat';
            const timeStamp = conversation.latestMessage ? new Date(conversation.latestMessage.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";

            return (
              <div className={'sb-conversation-container' + (lightTheme ? "" : " dark ")}
                key={index}
                onClick={() => navigate(`chat/${conversation._id}&${otherUser.name}`)}>
                {/* <p className='sb-con-icon'>{otherUser.name[0]}</p> */}
                <Avatar alt="Image" src={personImage6} className='sb-con-icon'/>
                <p className={'sb-con-title' + (lightTheme ? "" : " dark ")}>{otherUser.name}</p>
                <p className={'sb-con-lastMessage' + (lightTheme ? "" : " dark ")}>{latestMessageContent}</p>
                <p className={'sb-con-timeStamp' + (lightTheme ? "" : " dark ")}>{timeStamp}</p>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export default Sidebar;
