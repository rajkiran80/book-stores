import style from "./css/CreateBook.module.css";
import {useState} from "react";
import axios from "axios";
import {useRef,useEffect} from "react";
import {CREATE_BOOK_API_LINK} from "../ApiLinks";
import { useNavigate } from "react-router-dom";

const CreateBook=()=>{
    const [bookData,setBookData]=useState({bookName:"",authorName:"",bookPrice:"",from:"",to:"",avlQty:"",file:""});
    const [error,setError]=useState(false);
    const [errorMessage,setErrorMessage]=useState("");
    const [isUploading,setIsUploading]=useState(false);
    let navigate=useNavigate();
    let ref=useRef();
    const isFromToValid=()=>{
        if(bookData.from > bookData.to){
            setErrorMessage("enter valid starting and ending year of publication");
            setError(true);
            return false;
        }
        return true;
    }
    const isAvlQtyValid=()=>{
         if(bookData.avlQty <= 0){
            setErrorMessage("enter valid quantity");
            setError(true);
            return false;
         }
         return true;
    }
    const addBook=async (e)=>{
        e.preventDefault();
        setError(false);
        if(isFromToValid() && isAvlQtyValid()){
             try{
                    setIsUploading(true);
                    let formData=new FormData();
                    formData.append("file",bookData.file);formData.append("bookName",bookData.bookName);
                    formData.append("authorName",bookData.authorName.trim());formData.append("bookPrice",bookData.bookPrice);
                    formData.append("from",bookData.from);formData.append("to",bookData.to);formData.append("avlQty",bookData.avlQty);
                    const results=await axios.post(CREATE_BOOK_API_LINK,formData);
                 if(results.data.message !== true){
                    setError(true);
                    setErrorMessage(results.data.message);
                 }else{
                    alert("book is added successfully");
                    setIsUploading(false);
                    setBookData({bookName:"",authorName:"",bookPrice:"",from:"",to:"",avlQty:"",file:""});
                    ref.value=null;
                    navigate("/admin/dashboard");
                 }
             }catch(err){
                    setError(true);
                    setErrorMessage("unexpected error");
                    setIsUploading(false);
             }
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
            const passwordId=parsedjsonId.pswd;
            if(parsedjson === null || pswd !== passwordId || email !== emailId || isAdmintemp !== isAdmintempId || isAdmintemp === false){
                navigate("/admin");
            }
        }else{
                navigate("/admin");
        }
    });
    return(

        <div className={style.createBookContainer}>
              <h3>CREATE BOOK</h3>
              <div className={style.createFormWrapper}>
                    <form onSubmit={(e)=>addBook(e)}>
                          <input type="text" value={bookData.bookName} placeholder="enter book name" required onChange={(e)=>setBookData({...bookData,bookName:e.target.value})}/>
                          <input type="text" value={bookData.authorName} placeholder="enter author name" required onChange={(e)=>setBookData({...bookData,authorName:e.target.value})}/>
                          <input type="number" value={bookData.bookPrice} placeholder="enter book price" required onChange={(e)=>setBookData({...bookData,bookPrice:parseInt(e.target.value)})}/>
                          <div style={{display:"flex"}}>
                              <input type="number" value={bookData.from} placeholder="from" style={{width:"100px"}} required onChange={(e)=>setBookData({...bookData,from:parseInt(e.target.value)})}/>
                              <input type="number" value={bookData.to} placeholder="to" style={{width:"100px"}} required onChange={(e)=>setBookData({...bookData,to:parseInt(e.target.value)})}/>
                          </div>
                          <input type="number" value={bookData.avlQty} placeholder="enter available book quantity" required onChange={(e)=>setBookData({...bookData,avlQty:parseInt(e.target.value)})}/>
                          <input type="file" ref={ref} required onChange={(e)=>setBookData({...bookData,file:e.target.files[0]})}/>
                          <input type="submit" value={isUploading ? `wait book is uploading...`:`ADD BOOK`}/>
                    </form>
                    {error && <h4 style={{color:"red",marginTop:"5px"}}>{errorMessage}</h4>}
              </div>
        </div>
    )
}
export default CreateBook;