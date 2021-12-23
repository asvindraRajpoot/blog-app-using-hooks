
import { tagsURL } from "../utils/constant";
import Loader from "./Loader";
import useDataFetch from "./useDataFetch";

function Tags(props){
   
    let allTags = "", error="";
    let obj = {method: "GET"};
    let info = useDataFetch(tagsURL, obj);
    if(info.data) {
        allTags = info.data.tags.filter(tag => Boolean(tag));
    }
    if(info.error){
        error = "Not able to fetch Tags";
    }
    
    if(error) {
        return <h2 className="text-red-500 text-center text-xl mt-8">{error}</h2>
        }
        if(!allTags) {
        return < Loader />
        }
    return (
        <div className="flex flex-wrap bg-gray-200 px-4 py-8 rounded-md">
            {
                allTags.map(tag => {
                        return  <span key={tag} className={props.tagSelected === tag ? "bg-red-500 p-2 cursor-pointer text-white text-xs rounded-md mx-1 my-1" : "bg-gray-700 p-2 cursor-pointer text-white text-xs rounded-md mx-1 my-1"} onClick={(e) => props.selectTag(e)} data-value={tag}>{tag}</span>
                })
            }
        </div>
    )
}


export default Tags;