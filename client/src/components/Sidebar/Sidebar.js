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
import { IconButton } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../features/themeSlice';
import personImage from '../../assets/images/person.png';
import groupsImage from '../../assets/images/groups.png';
import axios from 'axios';

function Sidebar() {
  const userData = useMemo(() => JSON.parse(sessionStorage.getItem("userData")), []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lightTheme = useSelector((state) => state.themeKey);
  const refresh = useSelector((state) => state.refreshKey);
  const [conversations, setConversations] = useState([]);
  const [userProfile, setUserProfile] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Search query state


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


  useEffect(() => {
    if (conversations.length > 0) {
      const userProfileData = conversations[0]?.users?.find(user => user._id === userData.data._id);
      setUserProfile(userProfileData);
    }
  }, [conversations, userData]);

  if (!userData) {
    return null;
  }


  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation => {
    if (conversation.isGroupChat) {
      return conversation.chatName.toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      const otherUser = conversation.users.find(user => user._id !== userData.data._id);
      return otherUser ? otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    }
  });



  return (
    <div className="sb-container">
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
            {lightTheme ? <NightlightIcon className={"sb-icon" + (lightTheme ? "" : " dark ")} /> :
              <LightModeIcon className={"icon" + (lightTheme ? "" : " dark ")} />}
          </IconButton>

          <IconButton onClick={() => {
            sessionStorage.removeItem("userData");
            navigate('/');
          }}>
            <ExitToAppIcon className={"sb-icon" + (lightTheme ? "" : " dark ")} />
          </IconButton>

          <IconButton onClick={() => navigate('/app/profile')}>
            <Avatar
              src={userProfile && userProfile.image ? `http://localhost:8080/Images/${userProfile.image}` : personImage}
              className={"profile-sb-icon" + (lightTheme ? "" : " dark ")}
              alt="Remy Sharp"
            />
          </IconButton>
        </div>
      </div>

      <div className={"sb-search" + (lightTheme ? "" : " dark ")}>
        <IconButton>
          <SearchIcon className={"sb-icon" + (lightTheme ? "" : " dark ")} />
        </IconButton>
        <input
          type="text"
          placeholder='search'
          className={"sb-search-box" + (lightTheme ? "" : " dark ")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={"sb-conversations" + (lightTheme ? "" : " dark ")}>
        {filteredConversations.map((conversation, index) => {
          if (conversation.isGroupChat) {
            const latestMessageContent = conversation.latestMessage ? conversation.latestMessage.content : 'No previous Messages, click here to start a new chat';
            const timeStamp = conversation.latestMessage ? new Date(conversation.latestMessage.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";

            return (
              <div className={'sb-conversation-container' + (lightTheme ? "" : " dark ")}
                key={index}
                onClick={() => navigate(`chat/${conversation._id}&"${conversation.chatName}"`)}>
                <Avatar
                  src={conversation && conversation.image ? `http://localhost:8080/Images/${conversation.image}` : groupsImage}
                  alt="Image"
                  className='sb-con-icon'
                />
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
                onClick={() => navigate(`chat/${conversation._id}&${otherUser._id}`)}>
                <Avatar
                  src={otherUser && otherUser.image ? `http://localhost:8080/Images/${otherUser.image}` : personImage}
                  alt="Image"
                  className='sb-con-icon'
                />
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
