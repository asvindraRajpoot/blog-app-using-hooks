import React from "react";
import { articlesURL } from "../utils/constant";
import Loader from "./Loader";
import {withRouter} from "react-router-dom";
import CommentBox from "./CommentBox";
import UserContext from "../context/userContext";
import {useContext} from "react";
import useDataFetch from "./useDataFetch";

function Article(props){
  
    let article = null, error = null;
    let userInfo = useContext(UserContext);
    let {isLoggedIn, user} = userInfo.data;
    let obj = {method: "GET"};
    let info = useDataFetch(articlesURL + `/${props.match.params.slug}`, obj);
    if(info.data) {
        article = info.data.article;
    }
    if(info.error) {
        error = "Not able to fetch Articles";
    }
     
    const getDate = (date) => {
        let newDate =  new Date(date).toISOString().split('T')[0];
         return newDate;
     }

    const handleEdit = () => {
         let {slug} = article;
         console.log(props, "props");
         props.history.push({
             pathname: `/articles/edit/${slug}`,
             article: article
         });
     }

     const handleDelete = () => {
         let {user} = userInfo.data;
         fetch(articlesURL + "/" + props.match.params.slug, {
             method: "DELETE",
             headers: {
                 "Authorization": "Bearer " + localStorage.token
             }
         })
         .then((res) => {
            if(!res.ok) {
                return res.json().then(({errors}) => {
                    return Promise.reject(errors);
                })
            }
            props.history.push(`/profiles/${user.username}`);
         })
         .catch((err) => console.log(err));
     }

        if(error) {
            return <h2 className="text-red-500 text-center text-xl mt-8">{error}</h2>
        }

        if(!article) {
            return < Loader />
        } 
            let {tagList} = article; 
        return (
            <main className="pb-12">

                {/* hero section */}
                <section className="px-20 bg-articlePage text-white py-12">
                    <h2 className="mt-2 mb-3 text-4xl">{article.title}</h2>
                    <p className="">{article.description}</p>
                    <div className="flex flex-col items-start py-6 sm:flex-row sm:items-center">
                        <img src={article.author.image} alt={article.author.username} className="w-16 h-16 object-cover rounded-full"/>
                        <span className="mx-3 my-2">{article.author.username}</span>
                        <span className="mx-3 my-1">{getDate(article.createdAt)}</span>
                    </div>
                   <div className="flex flex-col sm:flex-row sm:justify-between">
                       <div className="flex flex-col sm:flex-row sm:justify-between">
                            {
                                tagList.map((tag) => {
                                    return tag && <span key={tag} className="mr-3 bg-red-400 p-1 px-2 text-xs rounded-md w-max my-2">{tag}</span>
                                })
                            }
                        </div>
                       
                        <div className="my-3">
                            <span className={isLoggedIn && user.username === article.author.username ? "bg-blue-500 py-2 px-4 text-white rounded-md mr-4 cursor-pointer": "hidden"} onClick={handleEdit}>Edit</span>

                            <span className={isLoggedIn && user.username === article.author.username ? "bg-red-500 py-2 px-4 text-white rounded-md mr-4 cursor-pointer": "hidden"}onClick={handleDelete}>Delete</span>
                        </div>
                   </div>
                </section> 

                {/* article body */}
                 <section className="px-20 py-12">
                    <p className="text-xl">{article.body}</p>
                </section> 

                <section className="px-20">
                    <h2 className="text-3xl font-bold">Comments</h2>
                    < CommentBox slug={article.slug}/>
                </section> 
            </main>
        )
    }


export default withRouter(Article);