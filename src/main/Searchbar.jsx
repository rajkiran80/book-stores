import style from "../css/Searchbar.module.css";
import store from "../redux";
import {useState,useEffect} from "react";

const Searchbar=()=>{
    const [searchedBookName,setSearchedBookName]=useState("");
    const handleSearch=(e)=>{
        const searchedName=e.target.value.trim();
        store.dispatch({
            type:"SEARCH",
            searchedBook:searchedName
        });
    }
    return (
        <div className={style.searchBar}>
            <input type="text" placeholder="search book" onChange={(e)=>handleSearch(e)}/>
        </div>
    )
}
export default Searchbar;