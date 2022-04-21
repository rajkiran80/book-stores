import style from "./Login.module.css";
import axios from "axios";
import { useState,useEffect } from "react";
import {Login_API_LINK} from "../ApiLinks";
import { useNavigate } from "react-router-dom";

const Login=({isAdmin})=>{
    const [userData,setUserData]=useState({email:"",pswd:""});
    const [isError,setIsError]=useState(false);
    const [errorMessage,setErrorMessage]=useState("");
    const [isLoging,setIsLoging]=useState(false);
    let navigate=useNavigate();
    const login=async ()=>{
         setIsError(false);
         setErrorMessage("");
         try{
             setIsLoging(true);
             const results=await axios.post(Login_API_LINK,userData);
             if(results.data.message){
               setIsError(true);
               setErrorMessage(results.data.message);
               setIsLoging(false);
               return;
            }
            localStorage.setItem("user",JSON.stringify(results.data));
            if(results.data.isAdmin === false){
                localStorage.setItem(results.data._id,JSON.stringify({isAdmin:false,pswd:results.data.password,email:results.data.email}));
                navigate("/");
                return;
            }else{
                localStorage.setItem(results.data._id,JSON.stringify({isAdmin:true,pswd:results.data.password,email:results.data.email}));
                navigate("/admin/dashboard");
                return;
            }
            setIsLoging(false);
         }catch(err){
              setIsError(true);
              setErrorMessage("something went wrong");
              setIsLoging(false);
         }
    }
    useEffect(()=>{
        if(localStorage.getItem("user")){
            //user localStorage
            const parsedjson=JSON.parse(localStorage.getItem("user"));
            const id=parsedjson._id;
            const pswd=parsedjson.password;
            const isAdmintemp=parsedjson.isAdmin;
            const email=parsedjson.email;
            //id localStorage
            const parsedjsonId=JSON.parse(localStorage.getItem(id));
            const isAdmintempId=parsedjsonId.isAdmin;
            const emailId=parsedjsonId.email;
            const passwordId=parsedjsonId.password;
            if(parsedjsonId !== null && email === emailId && pswd === passwordId && isAdmintemp === isAdmintempId && isAdmin === true){
                navigate("/admin/dashboard");
            }else if(parsedjsonId !== null && email === emailId && pswd === passwordId && isAdmintemp === isAdmintempId && isAdmin === false){
                navigate("/");
            }
        }
    },[])
    return (
         <div className={style.loginWrapper}>
               <h4 className={style.authTitle}>LOGIN {isAdmin && "ADMIN"}</h4>
               <input type="text" placeholder="enter your email" onChange={(e)=>setUserData({...userData,email:e.target.value})}/>
               <input type="password" placeholder="enter your password" onChange={(e)=>setUserData({...userData,pswd:e.target.value})}/>
               <h4 style={{color:"red",textAlign:"center"}}>{isError && errorMessage}</h4>
               <button className={style.btn} onClick={()=>login()}>{isLoging ? "wait logging...":"LOGIN"}</button>
         </div>
    )
}
export default Login;