import style from "./css/Dashboard.module.css";
import {Link} from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard=()=>{
    let navigate=useNavigate();
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
            const passwordId=parsedjsonId.pswd;
            if(parsedjsonId === null || pswd !== passwordId || email !== emailId || isAdmintemp !== isAdmintempId || isAdmintemp === false){
                navigate("/admin");
            }
        }else{
                navigate("/admin");
        }
    })
    return(
        <div className={style.dashboardContainer}>
              <h2>Welcome To Dashboard</h2>
              <div className={style.crud}>
                    <ul>
                        <li><Link to="/admin/dashboard/create-book">CREATE BOOK</Link></li>
                        <li><Link to="/admin/dashboard/update-book">UPDATE BOOK</Link></li>
                    </ul>
              </div>
        </div>
    )
}
export default Dashboard;