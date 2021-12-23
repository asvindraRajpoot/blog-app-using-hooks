
import React from "react";
import UserContext from "../context/userContext";
import { articlesURL } from "../utils/constant";
import Comments from "./Comments";
import {useState,  useContext} from "react";
import useDataFetch from "./useDataFetch";

function CommentBox(props) {
    
    let comments = null;
    let [inputText, setInputText] = useState("");
    let [submit, setSubmit] = useState(false);
    let [remove, setRemove] = useState(false);
    let userInfo = useContext(UserContext);
    let slug = props.slug;
    let body = {method: "GET"};
   
    let info = useDataFetch(articlesURL + "/" + slug + "/comments", body, [submit, remove]);
    if(info.data) {
        comments = info.data.comments;
    }
    if(info.error) {
        console.log(info.error);
    }

    const handleChange = ({target}) => {
        let {value} = target;
        setInputText(value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let slug = props.slug;
        if(inputText) {
            fetch(articlesURL + "/" + slug + "/comments", {
                method: "POST",
                body: JSON.stringify({comment: {body: inputText}}),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.token
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
                console.log(data);
                setInputText("");
                setSubmit(!submit);
            })
            .catch((err) => console.log(err));
        }
    };

    const handleDelete = ({target}) => {
        let {id} = target.dataset;
        console.log(typeof id);
        let slug = props.slug;
        fetch(articlesURL + "/" + slug + "/comments/" + id, {
            method: "DELETE",
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
            setRemove(!remove);
        })
        .catch((err) => console.log(err));
    }
    
   

    let {isLoggedIn} = userInfo.data;
    return (
            <>
                <div className={isLoggedIn ? "" : "hidden"}>
                    <form className="my-6 w-full" onSubmit={handleSubmit}>
                        <textarea className="w-full border-2 border-gray-400 rounded-md p-3 outline-none focus:border-blue-500" rows="6" placeholder="Enter Comments" value={inputText} onChange={handleChange} name="inputText"></textarea>
                        <input type="submit" value="Add Comment" className="bg-blue-500 w-min self-end my-4 py-2 px-4 text-white rounded-md cursor-pointer hover:bg-blue-400"/>
                    </form>
                </div>
                <div className="my-8">
                    < Comments  comments = {comments} handleDelete={handleDelete}/>
                </div>
            </>
            )
        }
        

export default CommentBox;