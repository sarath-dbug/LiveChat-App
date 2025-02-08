import React, { useEffect, useState } from 'react';
import "./ChatArea.css"
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Avatar from '@mui/material/Avatar';
import personImage from '../../assets/images/person.png';
import groupsImage from '../../assets/images/groups.png';
import MessageOthers from '../MessageOthers/MessageOthers';
import MessageSelf from '../MessageSelf/MessageSelf';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import axios from 'axios';
import { refreshSidebarFun } from '../../features/refreshSidebar';
import io from 'socket.io-client';
import backendURL from '../../config/config';

const ENDPOINT = "https://livechat-backend-8z5r.onrender.com";
let socket;

function ChatArea() {
  console.log(`${backendURL}/message`);
  
  const lightTheme = useSelector((state) => state.themeKey);
  const refresh = useSelector((state) => state.refreshKey);
  const dispatch = useDispatch();
  const [messageContent, setMessageContent] = useState('');

  const paramsId = useParams();
  const [chat_id, chat_userId] = paramsId._id.split('&');
  const isName = /[^\da-fA-F]/.test(chat_userId); //check group chat or not
  let group_name = chat_userId.replace(/^"|"$/g, ''); // if group _chat Remove " " marks if they exist

  const userData = JSON.parse(sessionStorage.getItem('userData'));
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatuser, setChatUser] = useState();
  console.log("chatuser : ", chatuser);

  // Function to send a message
  const sendMessage = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };

    axios
      .post(
        `${backendURL}/message/`,
        {
          content: messageContent,
          chatId: chat_id,
        },
        config
      )
      .then((response) => {
        const data = response.data;
        socket.emit('new message', data);
        setAllMessages((prevMessages) => [...prevMessages, data]);
        setMessageContent('');
        dispatch(refreshSidebarFun());
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
  };

  // Connect to socket
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', userData);
    socket.on('connected', () => {
      console.log('Socket connected');
    });
    socket.on('message received', (newMessage) => {
      if (newMessage.chat._id === chat_id) {
        setAllMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [chat_id, userData]);

  // Fetch chats
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };
    axios
      .get(`${backendURL}/message/${chat_id}`, config)
      .then(({ data }) => {
        setAllMessages(data);
        setLoading(true);
        socket.emit('join chat', chat_id);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });
  }, [refresh, chat_id, userData.data.token]);


  useEffect(() => {
    const fetchChatUser = async () => {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.get(`${backendURL}/user/fetchChatuser/${chat_userId}`, config);
        console.error('fetching chat user:', data);
        setChatUser(data);
      } catch (error) {
        console.error('Error fetching chat user:', error);
      }
    };

    fetchChatUser();
  }, [chat_userId]);



  if (!loading) {
    return (
      <div
        style={{
          border: '20px',
          padding: '10px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{ width: '100%', borderRadius: '10px' }}
          height={60}
        />
        <Skeleton
          variant="rectangular"
          sx={{
            width: '100%',
            borderRadius: '10px',
            flexGrow: '1',
          }}
        />
        <Skeleton
          variant="rectangular"
          sx={{ width: '100%', borderRadius: '10px' }}
          height={60}
        />
      </div>
    );
  } else {
    return (
      <div className={'chatArea-container' + (lightTheme ? '' : ' dark ')}>
        {!isName ? (
          <div className={'chatArea-header' + (lightTheme ? '' : ' dark ')}>
            <Avatar
              src={chatuser && chatuser.image ? `${backendURL}/Images/${chatuser.image}` : personImage}
              alt="Remy Sharp"
              sx={{ width: 50, height: 50, marginLeft: 2, marginRight: 1 }}
            />
            {chatuser && (
              <div className={'chatArea-header-text' + (lightTheme ? '' : ' dark ')}>
                <p className={'chatArea-con-title' + (lightTheme ? '' : ' dark ')}>{chatuser.name}</p>
                {chatuser.is_online && <p className="onlineStatus">online</p>}
              </div>
            )}
            <IconButton>
              <DeleteIcon className={'chatArea-icon' + (lightTheme ? '' : ' dark ')} />
            </IconButton>
          </div>
        ) : (
          <div className={'chatArea-header' + (lightTheme ? '' : ' dark ')}>
            <Avatar
              src={groupsImage}
              alt="Remy Sharp"
              sx={{ width: 50, height: 50, marginLeft: 2, marginRight: 1 }}
            />
            <div className={'chatArea-header-text' + (lightTheme ? '' : ' dark ')}>
              <p className={'chatArea-con-title' + (lightTheme ? '' : ' dark ')}>{group_name}</p>
            </div>
            <IconButton>
              <DeleteIcon className={'chatArea-icon' + (lightTheme ? '' : ' dark ')} />
            </IconButton>
          </div>
        )}

        <div className={'chatArea-messages-container' + (lightTheme ? '' : ' dark ')}>
          {allMessages
            .slice(0)
            .reverse()
            .map((message, index) => {
              const sender = message.sender;
              const self_id = userData.data._id;
              if (sender._id === self_id) {
                return <MessageSelf props={message} key={index} />;
              } else {
                return <MessageOthers props={message} key={index} />;
              }
            })}
        </div>
        <div className={'chatArea-text-input-area' + (lightTheme ? '' : ' dark ')}>
          <input
            type='text'
            placeholder='Type a Message'
            className={'chatArea-search-box' + (lightTheme ? '' : ' dark ')}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.code === 'Enter') {
                sendMessage();
              }
            }}
          />
          <IconButton
            className={'chatArea-icon' + (lightTheme ? '' : ' dark ')}
            onClick={() => {
              sendMessage();
            }}
          >
            <SendIcon />
          </IconButton>
        </div>
      </div>
    );
  }
}

export default ChatArea;
