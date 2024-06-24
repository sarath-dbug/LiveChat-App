import React, { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import MessageOthers from './MessageOthers';
import MessageSelf from './MessageSelf';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import axios from 'axios';
import { refreshSidebarFun } from '../Features/refreshSidebar';
import io from 'socket.io-client';

const ENDPOINT = 'http://localhost:8080';
let socket;

function ChatArea() {
  const lightTheme = useSelector((state) => state.themeKey);
  const refresh = useSelector((state) => state.refreshKey);
  const dispatch = useDispatch();
  const [messageContent, setMessageContent] = useState('');
  const paramsId = useParams();
  const [chat_id, chat_user] = paramsId._id.split('&');
  const userData = JSON.parse(sessionStorage.getItem('userData'));
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to send a message
  const sendMessage = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };

    axios
      .post(
        'http://localhost:8080/message/',
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
      .get(`http://localhost:8080/message/${chat_id}`, config)
      .then(({ data }) => {
        setAllMessages(data);
        setLoading(true);
        socket.emit('join chat', chat_id);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });
  }, [refresh, chat_id, userData.data.token]);

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
        <div className={'chatArea-header' + (lightTheme ? '' : ' dark ')}>
          <p className='con-icon'>{chat_user[0]}</p>
          <div className={'header-text' + (lightTheme ? '' : ' dark ')}>
            <p className={'con-title' + (lightTheme ? '' : ' dark ')}>{chat_user}</p>
          </div>
          <IconButton>
            <DeleteIcon className={'icon' + (lightTheme ? '' : ' dark ')} />
          </IconButton>
        </div>

        <div className={'messages-container' + (lightTheme ? '' : ' dark ')}>
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

        <div className={'text-input-area' + (lightTheme ? '' : ' dark ')}>
          <input
            type='text'
            placeholder='Type a Message'
            className={'search-box' + (lightTheme ? '' : ' dark ')}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.code === 'Enter') {
                sendMessage();
              }
            }}
          />
          <IconButton
            className={'icon' + (lightTheme ? '' : ' dark ')}
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
