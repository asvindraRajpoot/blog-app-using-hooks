import "../style/fullPageLoader.css";

function FullPageLoader(props) {
    return (
        <div className="containern h-screen bg-blue-400">
            <div className="loader">...</div>
	        <div id="load"></div>
        </div>
    )
}

export default FullPageLoader;