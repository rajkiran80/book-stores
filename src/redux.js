import {createStore} from "redux";

const reducer=(state={isEditOrDeletePopupOpen:0,searchedName:"",cartAddedProducts:[],isBookPresentInCart:new Map(),totalPrice:0},action)=>{
     if(action.type === "TOGGLE_POPPUP"){
           state.isEditOrDeletePopupOpen=action.isEditOrDeletePopupOpen;
     }else if(action.type === "SEARCH"){
           state.searchedName=action.searchedBook;
     }else if(action.type === "ADD_BOOK_IN_CART"){
           if(!state.isBookPresentInCart.has(action.book.pid)){
                state.isBookPresentInCart=state.isBookPresentInCart.set(action.book.pid,1);
                state.cartAddedProducts=[...state.cartAddedProducts,action.book];
                state.totalPrice=state.totalPrice+action.book.price;
           } 
     }else if(action.type === "modifyQty"){
           const updatedQtyCart=state.cartAddedProducts.filter((book)=>{
                  let isIncreDecre=parseInt(action.qty);
                  let cq=parseInt(book.qty);
                  let numberOfQTy=book.qty + isIncreDecre;
                  if(book.pid === action.pid){
                        if(numberOfQTy === 0){
                           //book is deleted from cart
                           state.isBookPresentInCart.delete(book.pid);
                        }else{
                           if(numberOfQTy <= book.avlQty){
                              book.qty=numberOfQTy;
                              book.totalPrice=book.qty * book.price;
                           }
                           return book;
                        }
                  }else{
                        return book;
                  }
           });
           state.cartAddedProducts=updatedQtyCart;
           //calculating total price in cart
           let total=0;
           for(let i=0;i<updatedQtyCart.length;i++){
                 total=total+updatedQtyCart[i].totalPrice;
           }
           state.totalPrice=total;
     }
     if(action.type === "CLEAR_CART"){
           state.cartAddedProducts=[];
           state.isBookPresentInCart=new Map();
           state.totalPrice=0;
     }
     return state;
}
const store=createStore(reducer);
export default store;