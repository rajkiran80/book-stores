import style from "./Register.module.css";
import {useState,useEffect} from "react";
import axios from "axios";
import {Register_API_LINK} from "../ApiLinks";
import { useNavigate } from "react-router-dom";

const Register=({isAdmin})=>{
    const [authDetails,setAuthDetails]=useState({name:"",email:"",key:"",pswd:"",confPswd:"",isAdmin:isAdmin});
    const [isError,setIsError]=useState(false);
    const [errorMessage,setErrorMessage]=useState("");
    const [isRegistering,setIsRegistering]=useState(false);
    let   navigate=useNavigate();
    const isEmailCorrect=()=>{
         if(authDetails.email.indexOf("@") !== -1 && authDetails.email.indexOf(".com") !== -1){
              return true;
         }
         setIsError(true);
         setErrorMessage("write correct email");
         return false;
    }
    const isPswdCorrect=()=>{
         if(authDetails.pswd === authDetails.confPswd){
            return true;
         }
         setIsError(true);
         setErrorMessage("password and confirm password should match");
         return false;
    }
    const isFieldEmpty=()=>{
        if(authDetails.name === "" || authDetails.email === "" || authDetails.pswd === "" || authDetails.key === "" || authDetails.confPswd === ""){
            setErrorMessage("all fields must be filled");
            setIsError(true);
            if(isAdmin === false && authDetails.key === ""){
                return true;
            }
            return false;
        }
        return true;
    }
    const signUp=async ()=>{
        let isValid=false;
        isValid=isFieldEmpty() && isEmailCorrect() && isPswdCorrect();
        if(!isValid){
            return;
        }
        setIsRegistering(true);
        setIsError(false);
        setErrorMessage("");
        try{
            const results=await axios.post(Register_API_LINK,authDetails);
            if(results.data.message){
                setIsError(true);
                setErrorMessage(results.data.message);
                setIsRegistering(false);
                return;
            }
            setIsRegistering(false);
            alert("successfully account is created");
            if(authDetails.isAdmin){
                 setAuthDetails({name:"",email:"",key:"",pswd:"",confPswd:"",isAdmin:isAdmin});
                 navigate("/admin");
            }else{
                 setAuthDetails({name:"",email:"",key:"",pswd:"",confPswd:"",isAdmin:isAdmin});
                 navigate("/auth");
            }
        }catch(err){
            setIsError(true);
            setErrorMessage("something went wrong");
            setIsRegistering(false);
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
            const isAdmintempId=parsedjson.isAdmin;
            const emailId=parsedjson.email;
            const passwordId=parsedjson.password;
            if(parsedjson !== null && email === emailId && pswd === passwordId && isAdmintemp === isAdmintempId && isAdmin === true){
                navigate("/admin/dashboard");
            }else if(parsedjson !== null && email === emailId && pswd === passwordId && isAdmintemp === isAdmintempId && isAdmin === false){
                navigate("/");
            }
        }
    })
    return (
        <div className={style.registerWrapper}>
               <h4 className={style.authTitle}>REGISTER {isAdmin && "ADMIN"}</h4>
               <input type="text" placeholder="enter your name" value={authDetails.name} onChange={(e)=>setAuthDetails({...authDetails,name:e.target.value})}/>
               <input type="text" placeholder="enter your email" value={authDetails.email} onChange={(e)=>setAuthDetails({...authDetails,email:e.target.value})}/>
               {isAdmin && <input type="text" placeholder="enter admin key" value={authDetails.key} onChange={(e)=>setAuthDetails({...authDetails,key:e.target.value})}/>}
               <input type="password" placeholder="enter your password" value={authDetails.pswd} onChange={(e)=>setAuthDetails({...authDetails,pswd:e.target.value})}/>
               <input type="password" placeholder="confirm your password" value={authDetails.confPswd} onChange={(e)=>setAuthDetails({...authDetails,confPswd:e.target.value})}/>
               <button className={style.btn} onClick={()=>signUp()}>{isRegistering ? "registering wait...":"SIGN UP"}</button>
               {isError && <h5 style={{color:"red",position:"relative",top:"3px"}}>{errorMessage}</h5>}
        </div>
    )
}
export default Register;