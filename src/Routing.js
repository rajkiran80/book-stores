import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import FourZeroFour from "./404";
import Home from "./Home";
import Navbar from "./main/Navbar";
import AuthContainer from "./includes/AuthContainer";
import HomeAdmin from "./admin/Home";
import Dashboard from "./admin/Dashboard";
import CreateBook from "./admin/CreateBook";
import UpdateBook from "./admin/UpdateBook";
import ListOfCartAddedProducts from "./main/ListOfCartAddedProducts";

const Routing=()=>{
  return (
      <>
          <Router>
               <Navbar/>
               <Routes>
                     <Route path="/" element={<Home/>}/>
                     <Route path="/auth" element={<AuthContainer/>}/>
                     <Route path="/auth" element={<AuthContainer/>}/>
                     <Route path="/cart" element={<ListOfCartAddedProducts/>}/>
                     <Route path="/admin" element={<HomeAdmin/>}/>
                     <Route path="/admin/dashboard" element={<Dashboard/>} />
                     <Route path="/admin/dashboard/create-book" element={<CreateBook/>}/>
                     <Route path="/admin/dashboard/update-book" element={<UpdateBook/>}/>
                     <Route path="*" element={<FourZeroFour/>} />
               </Routes>
          </Router>
      </>
  );
}

export default Routing;
