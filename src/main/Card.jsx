import style from "../css/Card.module.css";
import store from "../redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";



const Card=({bookid,bookName,authorName,from,to,imgUrl,price,avlQty})=>{
    let navigate=useNavigate();
    const addToCart=(bookId)=>{
        store.dispatch({
            type:"ADD_BOOK_IN_CART",
            book:{pid:bookId,bookName:bookName,authorName:authorName,from:from,to:to,price:price,imgUrl:imgUrl,avlQty:avlQty,qty:1,totalPrice:price}
        });
    }
    return(
        <div className={style.cardWrapper}>
            <div className={style.image}>
                <img src={imgUrl}/>
            </div>
            <div className={style.description}>
                <h4>{bookName}</h4>
                <hr/>
                <p>written by: <q>{authorName}</q></p>
                <p>year: <q style={{color:"#5dbea3"}}>{from} - {to}</q></p>
                <hr/>
                <button onClick={()=>addToCart(bookid)}>ADD TO CART</button>
            </div>
        </div>

    )
}
export default Card;