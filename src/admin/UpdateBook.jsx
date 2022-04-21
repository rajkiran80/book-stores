import style from "./css/UpdateBook.module.css";
import {Link} from "react-router-dom";
import CreateBook from "./CreateBook";
import {useState,useEffect} from "react";
import store from "../redux";
import EditBook from "./EditBook";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {Fetch_All_BOOK_API_LINK,Delete_Book_API_LINK} from "../ApiLinks";

const UpdateBook=()=>{
    //o=default,1=edit,2=delete
    const [isEditOrDelete,setIsEditOrDelete]=useState(0);
    const [books,setBooks]=useState(null);
    const [isLoading,setIsLoading]=useState(true);
    const [isDeleting,setIsDeleting]=useState(false);
    const [curentBookEditDetails,setCurrentBookEditDetails]=useState(null);
    const [error,setError]=useState(false);
    const [errorMessage,setErrorMessage]=useState("");
    const [currentId,setCurrentId]=useState();
    let navigate=useNavigate();
    const editBook=(id,bookName,authorName,bookPrice,from,to,avlQty,imgUrl)=>{
        setIsEditOrDelete(1);
        setCurrentBookEditDetails({id:id,bookName:bookName,authorName:authorName,bookPrice:bookPrice,from:from,to:to,avlQty:avlQty,imgUrl:imgUrl});
    };
    const deleteBook=async (id,imgUrl)=>{
        setIsEditOrDelete(2);
        try{
            setIsDeleting(true);
            setCurrentId(id);
            const prevImgArray=imgUrl.split("/");
            const imgName=prevImgArray[prevImgArray.length-1];
            const results=await axios.post(Delete_Book_API_LINK,{id:id,img:imgName});
            if(results.data.message !== true){
                setError(true);
                setErrorMessage(results.data.message);
                return;
            }
            setIsDeleting(false);
            alert("book deleted successfully");
            navigate("/admin/dashboard");
        }catch(err){
            setError(true);
            setErrorMessage("unexpected error");
        }
        
    };
    store.subscribe(()=>{
        if(isEditOrDelete === 0){
             setIsEditOrDelete(1);
        }else{
             setIsEditOrDelete(0);
        }
    });
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
        (
            async ()=>{
                try{
                    setIsLoading(true);
                    const results=await axios.get(Fetch_All_BOOK_API_LINK);
                    setBooks(results.data);
                    setIsLoading(false);
                }catch(err){
                    console.log(err);
                }
            }
        )();
    },[]);
    return(
        <div className={style.updateBookContainer}>
            <h2>{isEditOrDelete === 0 ? "UPDATE OR DELETE BOOK" : isEditOrDelete === 1 ? "UPDATE BOOK":"DELETE BOOK"}</h2>
                {
                    isLoading === false ?
                        <div className={style.listOfBooks}>
                            {       
                                isEditOrDelete === 1 ? <EditBook bookDetails={curentBookEditDetails}/> :
                                <table className={style.booksTable}>
                                    <tbody>
                                        <tr>
                                            <th className={style.title}>NAME</th>
                                            <th className={style.edit}>EDIT</th>
                                            <th className={style.delete}>DELETE</th>
                                        </tr>
                                        {
                                            books.map((book,index)=>{
                                                return  <tr key={index}>
                                                            <td>{book.bookName}</td>
                                                            <td><button onClick={()=>editBook(book._id,book.bookName,book.authorName,book.bookPrice,book.from,book.to,book.avlQty,book.imgUrl)}>EDIT</button></td>
                                                            <td><button onClick={()=>deleteBook(book._id,book.imgUrl)}>{isDeleting && currentId === book._id ? "deleting...":"DELETE"}</button></td>
                                                        </tr>
                                            })
                                        }
                                    </tbody>
                                    {error && <h4 style={{color:"red",marginTop:"5px"}}>{errorMessage}</h4>}
                                </table>
                            }
                        </div> : <h3 style={{backgroundColor:"black",color:"white",padding:"10px",borderRadius:"10px"}}>DATA IS LOADING.....</h3>
                }
        </div>
    )
}
export default UpdateBook;