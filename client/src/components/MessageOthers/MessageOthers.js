import React from 'react'
import './MessageOthers.css';
import { useSelector } from 'react-redux';

function MessageOthers({ props }) {
  const lightTheme = useSelector((state) => state.themeKey);
  const timeStamp = props.updatedAt ? new Date(props.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "200";
  
 if(props.chat.isGroupChat){
  return (
    <div className={"other-message-container" + (lightTheme ? "" : " dark ")}>
      <div className={"other-conversation-container" + (lightTheme ? "" : " dark ")}>
        <p className={"other-con-icon" + (lightTheme ? "" : " dark ")}>{props.sender.name[0]}</p>
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
