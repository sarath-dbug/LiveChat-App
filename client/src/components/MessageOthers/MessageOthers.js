import React from 'react'
import './MessageOthers.css';
import { useSelector } from 'react-redux';
import personImage from '../../assets/images/person.png';
import Avatar from '@mui/material/Avatar';

function MessageOthers({ props }) {
  const lightTheme = useSelector((state) => state.themeKey);
  const timeStamp = props.updatedAt ? new Date(props.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "200";
  console.log("props : ",props)
 if(props.chat.isGroupChat){
  return (
    <div className={"other-message-container" + (lightTheme ? "" : " dark ")}>
      <div className={"other-conversation-container" + (lightTheme ? "" : " dark ")}>
        {/* <p className={"other-con-icon" + (lightTheme ? "" : " dark ")}>{props.sender.name[0]}</p> */}
         <Avatar
              src={props.sender && props.sender.image ? `http://localhost:8080/Images/${props.sender.image}` : personImage}
              alt="Remy Sharp"
              sx={{
                width: 40,
                height: 40,
                justifySelf: 'center',
                alignSelf: 'center',
                marginLeft: '10px',
                marginRight: '5px',
              }}
            /> 
        <div className={"other-text-content" + (lightTheme ? "" : " dark ")}>
          <p className={"other-con-title" + (lightTheme ? "" : " dark ")}>{props.sender.name}</p>
          <p className={"other-con-lastMessage" + (lightTheme ? "" : " dark ")}>{props.content}</p>
          <p className={"other-timeStamp" + (lightTheme ? "" : " dark ")}>{timeStamp}</p>
        </div>
      </div>

    </div>
  )
 }else{
  return (
    <div className={"other-message-container" + (lightTheme ? "" : " dark ")}>
      <div className={"other-conversation-container" + (lightTheme ? "" : " dark ")}>
        <div className={"other-text-content" + (lightTheme ? "" : " dark ")}>
          <p className={"other-con-lastMessage" + (lightTheme ? "" : " dark ")}>{props.content}</p>
          <p className={"other-timeStamp" + (lightTheme ? "" : " dark ")}>{timeStamp}</p>
        </div>
      </div>

    </div>
  )
 }

}

export default MessageOthers
