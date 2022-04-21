import React, { useEffect, useState } from "react";
import style from "../css/RecommendedProduct.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import {RecommendProduct_API_LINK} from "../ApiLinks";
import Card from "../main/Card";
import store from "../redux";


const uniqueProduct=new Map();
const RecommendedProduct=()=>{
    const [recommendedProducts,setRecommendedProducts]=useState([]);
    const [isLoading,setIsLoading]=useState();

    useEffect(()=>{
         setIsLoading(true);
         (
            async ()=>{
                try{
                    const results=await axios.get(RecommendProduct_API_LINK);
                    let tempArray=[];
                    for(let i=0;i<results.data.length;i++){
                         if(!uniqueProduct.has(results.data[i].bookName)){
                              tempArray.push(results.data[i]);
                              uniqueProduct.set(results.data[i].bookName,1);
                         }
                    }
                    if(tempArray.length !== 0){
                      setRecommendedProducts(tempArray);
                    }
                    setIsLoading(false);
                }catch(err){
                    console.log("something wrong");
                }
             }
         )();
    },[]);
     return(
         <div className={style.recommendedProductWrapper}>
              {isLoading ? <h4>data is loading.....</h4> :
                <div>
                <h4 style={{textAlign:"center",padding:"10px"}}>Recommended Products</h4>
                    <div className={style.flexCard}>
                     {
                       recommendedProducts.map((book,index)=>{
                            return   <div className={style.cardWrapper} key={index}>
                                          <div className={style.image}>
                                              <img src={book.imgUrl}/>
                                          </div>
                                         <div className={style.description}>
                                            <h4>{book.bookName}</h4>
                                            <hr/>
                                            <p>written by: <q>{book.authorName}</q></p>
                                            <p>year: <q style={{color:"#5dbea3"}}>{book.from} - {book.to}</q></p>
                                            <hr/>
                                         </div>
                                    </div>
                       })
                     }
                    </div>
                 </div>
              }
         </div>
     )
}
export default RecommendedProduct;