import css from "./css/index.css";
import Navbar from "./main/Navbar";
import Card from "./main/Card";
import Searchbar from "./main/Searchbar";
import axios from "axios";
import {useState,useEffect} from "react";
import {Fetch_All_BOOK_API_LINK} from "./ApiLinks";
import store from "./redux";
import RecommendedProduct from "./main/RecommendedProduct";

const Home=()=>{
    const [data,setData]=useState([]);
    const [searchedBooks,setSearchedBooks]=useState([]);
    const [searchedBookName,setSearchedBookName]=useState("");
    const [isLoading,setIsLoading]=useState(true);
    const [error,setError]=useState(false);
    const [errorMessage,setErrorMessage]=useState("");
    const [updateUi,setUpdateUi]=useState(true);
    useEffect(()=>{
        setError(false);
        setIsLoading(true);
        setErrorMessage("");
         (
            async () => {
                try{
                    const results=await axios.get(Fetch_All_BOOK_API_LINK);
                    setData(results.data);
                    setSearchedBooks(results.data);
                    setIsLoading(false);
                }catch(err){
                    setError(true);
                    setErrorMessage("something went wrong");
                }
            }
         )();
    },[]);
    store.subscribe(()=>{
            if(data !== null){
                const searchedBookNames=store.getState().searchedName.toLowerCase();
                setSearchedBookName(searchedBookNames);
                const searchedBookList=data.filter((book)=>{
                    const {bookName,from,to,authorName}=book;
                    if(authorName.toLowerCase().indexOf(searchedBookNames) !== -1 || bookName.toLowerCase().indexOf(searchedBookNames) !== -1 || from.toString().toLowerCase().indexOf(searchedBookNames) !== -1 || to.toString().toLowerCase().indexOf(searchedBookNames) !== -1){
                        return book;
                    }
                });
                const isSearchedBook=searchedBookList.length === 0 && data === 0 ? data : searchedBookList;
                setSearchedBooks(isSearchedBook);
            }
            setUpdateUi(!updateUi);
    });
    return(
        <div className="container">
              <h2 style={{textAlign:"center"}}>All Available Books</h2>
              <Searchbar/>
              {
                  isLoading ? <h3>DATA IS LOADING......</h3> :
                  <div className="cardWrapper">
                        
                        {
                            searchedBookName !== "" && searchedBooks.length === 0 ? <h3 style={{color:"red"}}>sorry no book is available with the name "{<span style={{color:"green"}}>{searchedBookName}</span>}"</h3>:
                            searchedBooks.map((book,index)=>{
                                return book.avlQty > 0  &&  <div key={index}><Card bookid={book._id} keyId={index} bookName={book.bookName} 
                                                                                 authorName={book.authorName} from={book.from} 
                                                                                 to={book.to} imgUrl={book.imgUrl}
                                                                                 price={book.bookPrice}
                                                                                 avlQty={book.avlQty}
                                                                             />
                                                            </div>
                            })
                        }
                  </div>
                  
              }
              <RecommendedProduct/>
        </div>
    )
}
export default Home;