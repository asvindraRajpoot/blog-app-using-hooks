import {useState, useEffect, useContext} from "react";
import Articles from "./Articles";
import Tags from "./Tags";
import {articlesURL, feedURL}  from "../utils/constant";
import Pagination from "./Pagination";
import UserContext from "../context/userContext";

function Main(props){

    let userInfo = useContext(UserContext);
    let [articles, setArticles] = useState(null);
    let [error, setError] = useState("");
    let [articlesCount, setArticlesCount] = useState(null);
    let articlesPerPage = 10;
    let [tagSelected, setTagSelected] = useState("");
    let [feedSelected, setFeedSelected] = useState("");
    let [activePage, setActivePage] = useState(1);
    let [count, setCount] = useState(0);
    let {isLoggedIn} = userInfo.data;

    useState(() => {
        if(isLoggedIn) {
            setFeedSelected("myfeed");
        }else {
            setFeedSelected("global");
        }
    }, []);

    useEffect(() => {
        let offset = (activePage - 1) * 10;
        let tag = tagSelected;
        let url = feedSelected === "myfeed" ?  feedURL + `?limit=${articlesPerPage}&offset=${offset}` : articlesURL + `?limit=${articlesPerPage}&offset=${offset}` + (tag && `&tag=${tag}`);
        fetch(url, {
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
            console.log(data);
            setArticles(data.articles);
            setArticlesCount(data.articlesCount);
        })
        .catch((err) => {
            setError("Not able to fetch Articles")
        });
    }, [feedSelected, activePage, tagSelected, count]);

    const handleClick = ({target}) => {
        let {id} = target.dataset;
        setActivePage(id);
    }

    const selectTag = ({target}) => {
        let {value} = target.dataset;
        setTagSelected(value);
        setActivePage(1);
        setFeedSelected("");
    }

    const handleFavorite = ({target}) => {
        let {id, slug} = target.dataset;
        let method = id === "false" ? "POST" : "DELETE";
        if(isLoggedIn) {
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
                setCount(count + 1);
            })
            .catch((err) => console.log(err));
        }
    }

    console.log(isLoggedIn);
    return (
        
        // Hero section
            <main>
                <section className="px-8 py-12 lg:px-28 lg:py-12">
                    {/* feeds part */}
                    <div className="flex mb-3 text-xs sm:text-lg lg:text-xl">
                        <span className={!isLoggedIn?  "hidden": feedSelected === "myfeed" ? "mr-8 cursor-pointer text-green-500 pb-2 border-b-2 border-green-500": " mr-8 cursor-pointer green"}  onClick={() => {
                            setActivePage(1);
                            setFeedSelected("myfeed");
                            setTagSelected("");
                        }}> <i className="fas fa-newspaper mr-2"></i>
                            My feed
                        </span>
                        <span className={feedSelected === "global" ? "cursor-pointer text-green-500 pb-2 border-b-2 border-green-500": "cursor-pointer"} onClick={() => {
                            setTagSelected("");
                            setFeedSelected("global");
                            setActivePage(1);
                        }}>
                            <i className="fas fa-newspaper mr-2"></i>
                            Global Feed 
                        </span>
                        <div className={tagSelected ? "visible text-xs sm:text-lg lg:text-xl": "hidden"}>
                            <span className="mx-4 text-gray-500">/</span>
                            <span className="text-green-700 pb-2 border-b-2 border-green-700">#{tagSelected}</span>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:justify-between py-8">

                            {/* articles part */}
                        <div className="flex-100 lg:flex-70">
                            < Articles articles={articles} error={error} handleFavorite = {handleFavorite}/>
                        </div>

                    {/* tags part */}
                        <div className="flex-100 lg:flex-25">
                            < Tags selectTag={selectTag} tagSelected={tagSelected}/>
                        </div>
                    </div>
                        
                    {/* page indicator */}
                    <div className="flex justify-center flex-wrap pt-4 py-6">
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


export default Main;