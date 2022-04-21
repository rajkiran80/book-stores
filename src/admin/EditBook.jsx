import style from "./css/EditBook.module.css";
import {useRef,useState,useEffect} from "react";
import cross from "../images/cross.png";
import store from "../redux";
import {Update_Book_API_LINK} from "../ApiLinks";
import axios from "axios";
import { useNavigate } from "react-router";

const EditBook=(props)=>{
    const {id,bookName,authorName,bookPrice,from,to,avlQty,imgUrl}=props.bookDetails;
    const prevImgArray=imgUrl.split("/");
    const prevImgName=prevImgArray[prevImgArray.length-1];
    const [bookData,setBookData]=useState({bookName:"",authorName:"",bookPrice:"",from:"",to:"",avlQty:""});
    const [error,setError]=useState(false);
    const [errorMessage,setErrorMessage]=useState("");
    const [isUpdating,setIsUpdating]=useState(false);
    let navigate=useNavigate();
    let ref=useRef();
    const editBook=async (e)=>{
        e.preventDefault();
        setError(false);
        setErrorMessage("");
        try{
            setIsUpdating(true);
            const obj={bookName:bookData.bookName,authorName:bookData.authorName,
                       bookPrice:bookData.bookPrice,from:bookData.from,to:bookData.to,
                       avlQty:bookData.avlQty,id:id
                  };
            const results=await axios.post(Update_Book_API_LINK,obj);
            if(results.data.message !== true){
                setError(true);
                setErrorMessage(results.data.message);
                return;
            }
            alert("book updated sucessfully");
            setIsUpdating(false);
            navigate("/admin/dashboard");
        }catch(err){
            setError(true);
            setErrorMessage("unexpected error");
        }
    }
    const closeEditing=()=>{
        if(store.getState().isEditOrDeletePopupOpen === 1){
            store.dispatch({
                type:"TOGGLE_POPPUP",
                isEditOrDeletePopupOpen:0
            });
        }else{
            store.dispatch({
                type:"TOGGLE_POPPUP",
                isEditOrDeletePopupOpen:1
            });
        }
    }
    useEffect(()=>{
        setBookData({bookName:bookName,authorName:authorName,bookPrice:bookPrice,from:from,to:to,avlQty:avlQty,file:imgUrl});
    },[]);
    return(
        <div className={style.editBookWrapper}>
                <div className={style.crossSign} onClick={()=>closeEditing()}>
                    <img src={cross}/>
                </div>
                <div className={style.createFormWrapper}>
                    <form onSubmit={(e)=>editBook(e)}>
                          <input type="text" value={bookData.bookName} placeholder="edit book name" required onChange={(e)=>setBookData({...bookData,bookName:e.target.value})}/>
                          <input type="text" value={bookData.authorName} placeholder="edit author name" required onChange={(e)=>setBookData({...bookData,authorName:e.target.value})}/>
                          <input type="number" value={bookData.bookPrice} placeholder="edit book price" required onChange={(e)=>setBookData({...bookData,bookPrice:parseInt(e.target.value)})}/>
                          <div style={{display:"flex"}}>
                              <input type="number" value={bookData.from} placeholder="from" style={{width:"100px"}} required onChange={(e)=>setBookData({...bookData,from:parseInt(e.target.value)})}/>
                              <input type="number" value={bookData.to} placeholder="to" style={{width:"100px"}} required onChange={(e)=>setBookData({...bookData,to:parseInt(e.target.value)})}/>
                          </div>
                          <input type="number" value={bookData.avlQty} placeholder="edit available book quantity" required onChange={(e)=>setBookData({...bookData,avlQty:parseInt(e.target.value)})}/>
                          <input type="submit" value={isUpdating ? `wait book is updating...`:`UPDATE BOOK`}/>
                    </form>
                    {error && <h4 style={{color:"red",marginTop:"5px"}}>{errorMessage}</h4>}
                </div>
        </div>
    )
}
export default EditBook;