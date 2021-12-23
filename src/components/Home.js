
import {Link} from "react-router-dom";

function Home(props){

        return (
            <main>
                <div className="bg-green-500 py-12 text-white text-center">
                    <h2 className="py-6 text-3xl sm:text-5xl font-bold">Welcome to Blog App</h2>
                    <h4 className="text-lg sm:text-xl mb-6">Where good ideas find you...</h4>
                    < Link to="/articles">
                        <button className="bg-blue-500 text-white font-bold px-4 py-2 rounded-md">Go to Articles Page</button>
                    </Link>
                </div>
                {/* <div className="text-center pt-12">
                    <h2 className="text-5xl font-bold mb-8">Welcome to Blog App</h2>
                    < Link to="/articles">
                        <button className="bg-blue-500 text-white font-bold px-4 py-2 rounded-md">Go to Articles Page</button>
                    </Link>
                </div> */}
            </main>
            
        )
    }


export default Home;