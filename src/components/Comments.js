import Loader from "./Loader";
import {useContext} from "react";
import UserContext from "../context/userContext";

function Comments(props) {

    function getDate(date){
        let newDate =  new Date(date).toISOString().split('T')[0];
         return newDate;
     }

    let user = useContext(UserContext);
    let {comments} = props;
    let {isLoggedIn} = user.data;
    let loggedInUser = user.data.user.username;
    if(!comments) {
        return < Loader />
    }
    return (
        <>
            {
                comments.length > 0 ? comments.map((comment) => {
                return  <div key={comment.createdAt} className="flex flex-col sm:flex-row sm:item-center p-6 bg-gray-100 mb-8 relative shadow-custom rounded-md">
                            <div className="">
                                <img src={comment.author.image} alt={comment.author.username} className="w-16 h-16 rounded-full"/>
                            </div>
                            <div className="flex flex-col">
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                    <h4 className="my-2 sm:ml-6">{comment.author.username}</h4>
                                    <h4 className="my-2 sm:ml-6">#{getDate(comment.createdAt)}</h4>
                                    <span className={(loggedInUser === comment.author.username) && isLoggedIn ? "sm:absolute sm:right-4 text-xl" : "hidden"} >
                                        <i className="fas fa-trash cursor-pointer text-red-500" data-id={comment.id} onClick={(e) => props.handleDelete(e)}></i>
                                    </span>
                                </div>
                                <p className="sm:ml-6 my-4 text-xl font-semibold">{comment.body}</p>
                            </div>
                        </div>
                }): <h2 className="text-xl">No comments yet!</h2>
            }
        </>
    )
}

export default Comments;