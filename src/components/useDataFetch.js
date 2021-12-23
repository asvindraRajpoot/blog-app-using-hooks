import { useState, useEffect } from "react";

function useDataFetch(url, body, dep=[]) {
  
  let [data, setData] = useState(null);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    fetch(url, body)
    .then((res) => {
    if(!res.ok) {
      return res.json().then(({errors}) => {
          return Promise.reject(errors);
      })
    }
    return res.json();
    })
    .then((data) => {
      setData(data);
      setLoading(false);
    })
    .catch((err) => {
      setError(true);
      setLoading(false);
    });
  
  }, dep);

  return {
    data, 
    loading,
    error
  }
 
}

export default useDataFetch;