import React from 'react'
import logo from "../Images/comments_512px.png";
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion";

function Welcome() {
   
  const lightTheme = useSelector((state) => state.themeKey);
  const userData = JSON.parse(sessionStorage.getItem("userData"));

  const nav = useNavigate()
  
  if(!userData){
    nav("/")
  }

  return (
    <div className={'welcome-container'+ (lightTheme ? "" : " dark ")}>
      <motion.img
      drag
      whileTap={{ scale: 1.05, rotate: 360 }}
      src={logo}
      alt="Logo"
      className='welcome-logo'
      />
       
        <b>Hi, {userData.data.name} 👋</b>
        <p>view and text directly to people present in the chat Rooms.</p>
      
    </div>
  )
}

export default Welcome
