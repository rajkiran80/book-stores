import css from "../css/Navbar.module.css";
import {Link} from "react-router-dom";
import cartLogo from "../images/cart.png";
import profile from "../images/profile.png";
import {useLocation} from "react-router-dom";
import {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import store from "../redux";

const Navbar=()=>{
    const location=useLocation().pathname.split("/")[1];
    const [isAdmin,setIsAdmin]=useState(false);
    const [numberOfItenInCart,setNumerOfItemInCart]=useState(store.getState().cartAddedProducts.length);
    const [profileName,setProfileName]=useState("");
    let navigate=useNavigate();
    useEffect(()=>{
          if(location === "admin"){
             setIsAdmin(true);
          }
          if(localStorage.getItem("user")){
               const parsedjson=JSON.parse(localStorage.getItem("user"));
               setProfileName(parsedjson.name);
          }
    })
    store.subscribe(()=>{
        setNumerOfItemInCart(store.getState().cartAddedProducts.length);
    })
    const logout=()=>{
        localStorage.clear();
        if(isAdmin){
            navigate("/admin");
        }else{
            navigate("/auth");
        }
    }
    
    return(
        <div className={css.navbarContainer}>
             <ul>
                  <li className={css.logo}><Link to="/">bookAdda</Link></li>
                  <li className={css.profile}>
                      <img src={profile}/>
                      <ul className={css.dropdown}>
                          {profileName !== "" && <li>{profileName}</li>}
                          <li><Link to="/auth">Login</Link></li>
                          <li><Link to="/auth">Signup</Link></li>
                          {!isAdmin && <li><Link to="/orders">Orders</Link></li>}
                          <hr/>
                          <li><button onClick={()=>logout()} style={{cursor:"pointer"}}>LOGOUT</button></li>
                      </ul>
                  </li>
                  <li className={css.cart}>
                      <Link to="/cart">
                          <img src={cartLogo}/> <span style={{position:"absolute",top:"6px",left:"36px",fontSize:"20px",color:"red"}}>{numberOfItenInCart}</span>
                      </Link>
                  </li>
             </ul>
        </div>
    )
}
export default Navbar;