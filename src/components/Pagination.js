function Pagination(props) {

   function getTotalPages(articlesPerPage, articlesCount){

        let numberOfPages = Math.ceil(articlesCount / articlesPerPage);
        let arr = [];
        for(let i = 0; i < numberOfPages; i++){
            arr.push(i+1);
        }
        return arr;
    }

    let {articlesPerPage, articlesCount, activePage} = props;
    let arr = getTotalPages(articlesPerPage, articlesCount);
    return (
        <>
            {
                arr.length > 1 && arr.map((p, i) => {
                    return <span key={p} className={Number(activePage) ===  i + 1 ? "bg-black text-white py-2 px-4 mx-2 sm:mx-4 cursor-pointer my-2 ": "border border-gray-300 py-2 px-4 mx-2 sm:mx-4 my-2 cursor-pointer"} data-id={i+1} onClick={(e) => props.handleClick(e)}>{p}</span> 
                
                }) 
            }
        </>
    )
}

export default Pagination;