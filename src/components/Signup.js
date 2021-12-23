import {useState} from "react";
import {Link, withRouter} from "react-router-dom";
import { validate } from "../utils/validate";
import { registerURL } from "../utils/constant";

function Signup(props){
    
    let [username, setUserName] = useState("");
    let [email, setEmail] = useState("");
    let [passwd, setPasswd] = useState("");
    let [errors, setErrors] = useState({
        username: "",
        email: "",
        passwd: ""
    });

    const handleChange = ({target}) => {
        let {name, value} = target;
        let newErrors = errors;
        console.log(newErrors);
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
     }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(username && passwd && email) {
            fetch(registerURL, {
                method: "POST",
                body: JSON.stringify({user: {username, password: passwd, email}}),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then((res) => {
                if(!res.ok) {
                   return res.json().then((data) => {
                        for(let key in data.errors){
                            errors[key] = `${key} ${data.errors[key]}`; 
                          
                        }
                       return Promise.reject(errors);    
                   });
                }
                
                return res.json();
            })
            .then((data) => {
                props.history.push("/login");
            })
            .catch((err) => {
                setPasswd("");
                setEmail("");
                setUserName("");
                setErrors(errors);
            });
        }
    }
   
    return (
        <main>
            <section className="mt-20 px-8">
                <form className="w-full md:w-1/3 mx-auto border border-gray-400 p-6 rounded-md" onSubmit={handleSubmit}>
                    <div className="text-center">
                        <legend className="text-2xl font-bold">Sign Up</legend>
                        < Link to="/login">
                            <span className="text-blue-700 text-lg text-center">Have an account? </span>
                        </Link>
                    </div>
                    <fieldset className="my-3">
                        {/* <span className="text-red-500">{info}</span> */}
                        <input className="block w-full my-3 py-2 px-3 border border-gray-400 rounded-md"type="text" placeholder="Enter Username" value={username} name="username" onChange={(e) => handleChange(e)}/>
                        <span className="text-red-500">{errors.username}</span>

                        <input className="block w-full my-3 py-2 px-3 border border-gray-400 rounded-md"type="text" placeholder="Enter Email" value={email} name="email" onChange={(e) => handleChange(e)}/>
                        <span className="text-red-500">{errors.email}</span>

                        <input className="block w-full my-3 py-2 px-3 border border-gray-400 rounded-md"type="password" placeholder="Enter Password" value={passwd} name="passwd" onChange={(e) => handleChange(e)}/>
                        <span className="text-red-500">{errors.passwd}</span>

                        <input type="submit" value="Sign Up" className="block w-full my-6 py-2 px-3 bg-blue-500 text-white font-bold cursor-pointer" disabled={errors.username || errors.email || errors.passwd}/>
                    </fieldset>
                </form>
            </section>
        </main>
    )
}


export default withRouter(Signup);