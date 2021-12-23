import {useState, useContext, useEffect} from "react";
import Loader from "./Loader";
import { profileURL } from "../utils/constant";
import { articlesURL } from "../utils/constant";
import Articles from "./Articles";
import Pagination from "./Pagination";
import {withRouter} from "react-router-dom";
import UserContext from "../context/userContext";

function Profile(props){
    
    let [user, setUser] = useState("");
    let [following, setFollowing] = useState("");
    let [error, setError] = useState("");
    let [articlesCount, setArticlesCount] = useState(null);
    let articlesPerPage = 10;
    let [activePage, setActivePage] = useState(1);
    let [feedSelected, setFeedSelected] = useState("author");
    let [articles, setArticles] = useState(null);
    let [favoriteCount, setFavoriteCount] = useState(0);
    let userInfo = useContext(UserContext);
    
    useEffect(() => {
        let {id} = props.match.params;
        fetch(profileURL + id , {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.token
            }
        })
        .then((res => {
            console.log(res.ok);
            if(!res.ok) {
                return res.json().then(({errors}) => {
                    return Promise.reject(errors);
                })
            }
            return res.json();
        }))
        .then(({profile}) => {
            console.log({profile});
            setUser(profile);
            console.log(user, "profile");
            setFollowing(profile.following);
        })
        .catch((err) => console.log(err));
    }, [props.match.params]);

    const handleFollow = () => {
        let {username} = user;
        let method = following ? "DELETE" : "POST";
        fetch(profileURL + "/" + username + "/follow", {
            method: method,
            headers: {
                "Authorization": "Bearer " + localStorage.token
            }
        })
        .then((res) => {
            if(!res.ok) {
                return res.json().then(({errors}) => {
                    return Promise.reject();
                })
            }
            return res.json();
        })
        .then(({profile}) => {
            console.log(profile);
            setFollowing(profile.following);
        })
        .catch((err) => console.log(err));
    }

    const handleClick = ({target}) => {
        let {id} = target.dataset;
        setActivePage(id);
    }

    useEffect(() => {
        let username = user.username;
        console.log(user, "user");
        let offset = (activePage - 1) * 10;
        console.log(`${articlesURL}?${feedSelected}=${username}&limit=${articlesPerPage}&offset=${offset}`);
        if(username) {
            fetch(`${articlesURL}?${feedSelected}=${username}&limit=${articlesPerPage}&offset=${offset}`, {
                method: "GET",
                headers: {
                    "Authorization": "Token " + localStorage.token
                }
            })
            .then((res) => {
                if(!res.ok)  {
                    throw new Error(res.statusText);
                }
                return res.json();
            })
            .then((data) => {
                setArticles(data.articles);
                setArticlesCount(data.articlesCount);
            })
            .catch((err) => {
                setError("Not able to fetch Articles")
            });
        }
        
    }, [user, feedSelected, activePage, favoriteCount])

    const handleFavorite = ({target}) => {
        let {id, slug} = target.dataset;
        let method = id === "false" ? "POST" : "DELETE";
        console.log(method);
        console.log(id, slug);
            fetch(articlesURL + "/" + slug + "/favorite", {
                method: method,
                headers: {
                    "Authorization": "Token " + localStorage.token
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
               setFavoriteCount(favoriteCount + 1);
            })
            .catch((err) => console.log(err));
        }
        
    if(!user) {
        return < Loader />
    }
    let {username, image, bio} = user;
    let loggenInUser = userInfo.data.user.username;
    return (
        <main>
            <section>
                <div className="bg-articlePage text-white py-16 text-center">
                    <img src={image} alt={username} className="w-40 h-40 rounded-full mx-auto"/>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl my-4">{username}</h2>
                    <h3 className="sm:text-lg md:text-2xl text-pink-300">{bio}</h3>
                    <button className={loggenInUser !== username ? "visible bg-white text-gray-700 px-8 py-3 rounded-md mt-6": "hidden"} onClick={handleFollow}>{following ? `Unfollow ${username}` : `Follow ${username}`} </button>
                </div>

                <article className="px-8 sm:px-12 md:px-40">
                    <div className="py-12">
                        <span className={feedSelected === "author" ? "cursor-pointer text-md sm:text-xl text-green-500 pb-2 border-b-2 border-green-500": "cursor-pointer text-md sm:text-xl"}onClick={() => {
                           setFeedSelected("author");
                           setActivePage(1);
                        }}>
                                <i className="fas fa-newspaper mr-2"></i>
                            My Articles
                            </span>
                        <span className="mx-4">/</span>
                        <span className={feedSelected === "favorited" ? "cursor-pointer text-md sm:text-xl text-green-500 pb-2 border-b-2 border-green-500": "cursor-pointer text-md sm:text-xl"} onClick={() => {
                             setFeedSelected("favorited");
                             setActivePage(1);
                        }}> 
                        <i className="fas fa-newspaper mr-2"></i>
                        Favorited</span>
                    </div>
                    <div className="">
                        < Articles articles={articles} error={error} isLoggedIn={userInfo.data.isLoggedIn} handleFavorite={handleFavorite}/>
                    </div>
                </article>
                <div className="text-center py-8">
                        < Pagination 
                        articlesCount={articlesCount} 
                        articlesPerPage={articlesPerPage}
                        activePage={activePage}
                        handleClick = {handleClick}
                        />
                    </div>
            </section>
        </main>
    )
}

export default withRouter(Profile);