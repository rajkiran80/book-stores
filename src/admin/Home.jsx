import AuthContainer from "../includes/AuthContainer";

const HomeAdmin=()=>{
    return(
        <div className="homeContainer">
              <AuthContainer isAdmin={true}/>
        </div>
    )
}

export default HomeAdmin;