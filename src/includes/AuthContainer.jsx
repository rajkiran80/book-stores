import Login from "./Login";
import Register from "./Register";
import {Link} from "react-router-dom";
import {useState} from "react";
import style from "./AuthContainer.module.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContainer=({isAdmin=false})=>{
    const [currentAuth,setCurrentAuth]=useState(true);
    let navigate=useNavigate();
    const handleLoginSignup=(isLoginSignup)=>{
        setCurrentAuth(isLoginSignup);
    }
    //if admin is there then isAdmin=true else isAdmin=false
    useEffect(()=>{
        if(localStorage.getItem("user")){
            navigate("/");
        } 
            
    },[])
    return (
        <>
            <div className={style.authContainer}>
                {currentAuth ? <Login isAdmin={isAdmin}/> : <Register isAdmin={isAdmin}/>}
                <div className={style.wrapperButton}>
                      <button onClick={()=>handleLoginSignup(true)} style={{backgroundColor:"#1E90FF",color:"white"}}>LOGIN</button>
                      <button onClick={()=>handleLoginSignup(false)} style={{backgroundColor:"#FF69B4",color:"white"}}>SIGN UP</button>
                </div>
            </div>
        </>
    )
}
export default AuthContainer;