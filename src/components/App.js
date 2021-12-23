import {BrowserRouter as Router} from "react-router-dom";
import Header from "./Header";
import {useEffect, useState} from "react";
import { userURL } from "../utils/constant";
import FullPageLoader from "./FullPageLoader";
import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";
import ErrorBoundary from "./ErrorBoundary";
import {UserProvider} from "../context/userContext";

function App(props){
       
    let [isLoggedIn, setIsLoggedIn] = useState(false);
    let [user, setUser] = useState("");
    let [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        let token = localStorage.getItem("token");
        if(token) {
            let bearer = "Bearer " + token;
            fetch(userURL, {
                method: "GET",
                headers: {
                    "Authorization": bearer
                }
            })
            .then((res) => {
                if(!res.ok) {
                    return res.json().then(({errors}) => {
                        return Promise.reject(errors);
                    }) 
                }
                return res.json();
            })
            .then((data) => {
               handleUser(data.user);
            })
            .catch((err) => console.log(err));
        }else {
            setIsLoading(false);
        }
    }, [])

    const handleUser = (user) => {
        setIsLoggedIn(true);
        setUser(user);
        setIsLoading(false);
        localStorage.setItem("token", user.token);
    }

    const handleLogout = () => {
        setIsLoggedIn(false);
    }
    

    if(isLoading) {
        return < FullPageLoader />
    }    
    return (
        < Router>
            < UserProvider value={{data: {isLoggedIn, user}, handleUser: handleUser, handleLogout: handleLogout }}>
            < ErrorBoundary >
                    < Header />
                    {
                        isLoggedIn ? < AuthenticatedApp /> : < UnauthenticatedApp />
                    }
                </ErrorBoundary>
            </UserProvider>
        </Router>
    )
}
 
export default App;