import React from 'react'
import './LandingPage.css'
import landingImage from '../assets/mobile1.avif'
import landingImage1 from '../assets/mobile2.jpg'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
  const router = useNavigate();
  return (
    <div className='landingPageContainer'>
      <nav>
        <div className="logo"><h2 role='button' >Apna Video Call</h2></div>
        <div className="userIcon">
          <ul>
            <li onClick={()=>{
              router('/efdsf')
            }} role='button'>join as guest</li>
            <li onClick={()=>{
              router('/auth')
            }}>Register</li>
            <li onClick={()=>{
              router('/auth')
            }}>Login</li>
          </ul>
        </div>
      </nav>
      <div className="landingMainContainer">
        <div className="leftContainer">
        <h1><span style={{color:"#ff9839"}}>Connect</span> with Anyone</h1>
        <p>Experience seamless video communication with Apna Video Call. <br />
           Connect, collaborate, and communicate effortlessly with our <br />
           user-friendly platform designed for all your video calling needs.</p><br />
        <button role='button'>Get Started</button>        
        </div>
        <div className="rightContainer">
          <img src= {landingImage} alt="" />
          <img src= {landingImage1} alt="" />
        </div>

      </div>
    </div>
  )
}

export default LandingPage