import {useState,useEffect} from "react";
import style from "../css/ListOfCartAddedProduct.module.css";
import store from "../redux";
import axios from "axios";
import {Placed_order_API_LINK} from "../ApiLinks";
import { useNavigate } from "react-router-dom";

const ListOfCartAddedProducts=()=>{
    const [productsInCart,setProductsInCart]=useState([]);
    const [totalPrices,setTotalPrices]=useState(store.getState().totalPrice);
    const [updateUi,setUpdateUi]=useState(true);
    const [error,setError]=useState(false);
    const [errorMessage,setErrorMessage]=useState("");
    const [isUploading,setIsUploading]=useState(false);
    let navigate=useNavigate();
    useEffect(()=>{
        setProductsInCart(store.getState().cartAddedProducts);
    })
    const decrementQty=(pid)=>{
         store.dispatch({
             type:"modifyQty",
             qty:-1,
             pid:pid
         });
    }
    const incrementQty=(pid)=>{
        store.dispatch({
            type:"modifyQty",
            qty:1,
            pid:pid
        });
    }
    store.subscribe(()=>{
        setUpdateUi(!updateUi);
        setTotalPrices(store.getState().totalPrice);
    });
    const placeYourOrder=async ()=>{
        //is user logged in

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
            if(parsedjson === null || pswd !== passwordId || email !== emailId || isAdmintemp !== isAdmintempId){
                navigate("/auth");
                return;
            }
        }else{
                navigate("/auth");
                return;
        }

        //end
          setIsUploading(true);
          setErrorMessage("");
          try{
              const results=await axios.post(Placed_order_API_LINK,productsInCart);
              if(results.data.message !== true){
                setError(true);
                setErrorMessage(results.data.message);
             }else{
                alert("order is placed successfully");
                setIsUploading(false);
                store.dispatch({
                     type:"CLEAR_CART",
                });
                navigate("/");
             }
          }catch(err){
                setError(true);
                setErrorMessage("unexpected error");
                setIsUploading(false);
          }
    }
    return(
        <div className={style.cartItemsWrapper}>
             <h3>Cart Added Books</h3>
             {
                productsInCart.length === 0 ? <h3>cart is empty</h3> :
                productsInCart.map((book,index)=>{
                    return <div className={style.carts} key={index}>
                                <div className={style.img}>
                                    <img src={book.imgUrl}/>
                                </div>
                                <div className={style.details}>
                                    <h4>title: {book.bookName}</h4>
                                    <div>
                                         stocks: <span className={style.stockAvl}>{book.avlQty}</span>
                                    </div>
                                    <div>
                                        <h4>Price: Rs. {book.totalPrice}</h4>
                                    </div>
                                    <div>
                                        <button onClick={()=>decrementQty(book.pid)}>-</button>
                                            <span>{book.qty}</span>
                                        <button onClick={()=>incrementQty(book.pid)}>+</button>
                                    </div>
                                </div>
                            </div>
                })
             }
             <div className={style.totalPrice}>
                    <h3>total price is : {totalPrices}</h3>
             </div>
             {productsInCart.length > 0 && <button style={{width:"200px",backgroundColor:"green",borderRadius:"10px",padding:"4px"}} onClick={()=>placeYourOrder()}>{isUploading ? "order is placing....":"place your order"}</button>}
        </div>
    )
}
export default ListOfCartAddedProducts;