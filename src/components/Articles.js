import React from "react";
import {Link} from "react-router-dom";
import Loader from "./Loader";
import {withRouter} from "react-router-dom";
import {useContext} from "react";
import UserContext from "../context/userContext";

function Articles(props){

    let user = useContext(UserContext);
    let {isLoggedIn} = user.data;
    function getDate(date){
    let newDate =  new Date(date).toISOString().split('T')[0];
    return newDate;
    }
        
    let {articles, error} = props;
    if(error) {
        return <h2 className="text-red-500 text-center text-xl mt-8">{error}</h2>
    }

    if(!articles) {
        return < Loader />
    }
    
    if(!articles.length){
        return <h2 className="text-red-500 text-center text-xl mt-8">No articles found</h2>
    }
    return(
        <article>
            {
                articles.map(article => {
                    return (
                        <div key={article.slug} className="bg-gray-100 shadow-custom flex justify-between mb-12 w-full p-4 rounded-md">
                            <div>
                                <div className="flex items-center my-8">
                                    <img src={article.author.image} alt={article.author.username} className="w-14 h-14 rounded-full object-cover"/>
                                    <div className="ml-4">
                                        {
                                            isLoggedIn ? < Link to={`/profiles/${article.author.username}`}>
                                            <h5 className="text-red-500 font-bold text-md lg:text-xl">{article.author.username}</h5>
                                            </Link> : <h5 className="text-red-500 font-bold text-md lg:text-xl">{article.author.username}</h5>
                                        }
                                        <h6>{getDate(article.createdAt)}</h6>
                                    </div>
                                </div>
                                <h2 className="text-xl lg:text-2xl font-bold mb-2">{article.title}</h2>
                                <Link to={`/articles/${article.slug}`}>
                                    <h4 className="bg-green-400 text-white font-bold rounded-lg inline-block py-1 px-3 text-sm">Read More</h4>
                                </Link>
                            </div>
                            <div className="flex items-center sm:text-md lg:text-xl">
                                <i className={!isLoggedIn ?  "fas fa-heart": article.favorited ? "fas fa-heart cursor-pointer text-pink-600" : "fas fa-heart cursor-pointer" } onClick={(e) => props.handleFavorite(e)} data-id={article.favorited} data-slug={article.slug}></i>
                                <span className="ml-2">{article.favoritesCount}</span>
                            </div>
                        </div>
                    )
                }) 
            }
        </article>
    )
}
    


export default withRouter(Articles);