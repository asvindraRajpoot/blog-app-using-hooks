import {useState, useContext} from "react";
import {validate} from "../utils/validate";
import { userURL } from "../utils/constant";
import {withRouter} from "react-router-dom";
import UserContext from "../context/userContext";
import Loader from "./Loader";

function Settings(props){
    
    let userInfo = useContext(UserContext);
    let [image, setImage] = useState(userInfo.data.user.image);
    let [username, setUserName] = useState(userInfo.data.user.username);
    let [email, setEmail] = useState(userInfo.data.user.email);
    let [bio, setBio] = useState(userInfo.data.user.bio);
    let [passwd, setPasswd] = useState("");
    let [errors, setErrors] = useState({
        username: "",
        email: "",
        passwd: ""
    });

    const handleChange = ({target}) => {
        let {name, value} = target;
        let newErrors = errors;
        validate(newErrors, name, value);
        if(name === "username") {
            setUserName(value);
            setErrors(newErrors);
        }
        if(name === "email") {
            setEmail(value);
            setErrors(newErrors);
        }
        if(name === "passwd") {
            setPasswd(value);
            setErrors(newErrors);
        }
        if(name === "bio") {
            setBio(value);
            setErrors(newErrors);
        }
        if(name === "image") {
            setImage(value);
            setErrors(newErrors);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(username && image && passwd && email && bio) {
            fetch(userURL, {
                method: "PUT",
                body: JSON.stringify({user: {username, email, password: passwd, bio, image: "https://pbs.twimg.com/profile_images/1368973967025836036/yIJ1QI8o_400x400.jpg"}}),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.token
                }
            })
            .then((res) => {
                console.log(res);
                if(!res.ok) {
                    return res.json().then((data) => {
                        for(let key in data.errors) {
                            errors[key] = `${key} ${data.errors[key]}`;
                        }
                        return Promise.reject({errors});
                    })  
                }
                return res.json();
            })
            .then((data) => {
                userInfo.handleUser(data.user);
                props.history.push(`/profiles/${data.user.username}`);
            })
            .catch((err) => setErrors(errors));
        }
    }

    if(!username && !email && !image && !bio) {
        return < Loader />
    }

    return (
        <main className="">
            <section className="pt-20 px-8">
                <form className="w-full md:w-1/2 md:mx-auto p-8 border border-gray-400 rounded-md" onSubmit={handleSubmit}>
                    <legend className="text-center text-2xl sm:text-3xl my-2 font-bold">Settings</legend>
                    <fieldset className="">

                        <input type="text" placeholder="Image Url" value={image} onChange={handleChange} name="image" className="my-2 p-2 rounded-md outline-none border-2 border-gray-300 focus:border-blue-500 w-full"/>

                        <input type="text"  name="username" value={username} onChange={handleChange} className="my-2 p-2 rounded-md outline-none border-2 border-gray-300 focus:border-blue-500 w-full"/>
                        <span className="my-1 text-red-500">{errors.username}</span>
                        
                        <input type="email"  name="email" value={email} onChange={handleChange} className="my-2 p-2 rounded-md outline-none border-2 border-gray-300 focus:border-blue-500 w-full"/>
                        <span className="my-1 text-red-500">{errors.email}</span>
                        
                        <input type="password"  name="passwd" value={passwd} placeholder="Password" onChange={handleChange} className="my-2 p-2 rounded-md outline-none border-2 border-gray-300 focus:border-blue-500 w-full"/>
                        <span className="my-1 text-red-500">{errors.passwd}</span>

                        <textarea value={bio} rows="6" name="bio" placeholder="Enter your Bio" onChange={handleChange} className="my-2 p-2 rounded-md outline-none border-2 border-gray-300 focus:border-blue-500 w-full"></textarea>

                        <input type="submit" value="Update"  className="my-2 p-2 rounded-md outline-none bg-blue-500 hover:bg-blue-400 text-white w-full"></input>
                    </fieldset>
                </form>
            </section>
        </main>
    )
}


export default withRouter(Settings);