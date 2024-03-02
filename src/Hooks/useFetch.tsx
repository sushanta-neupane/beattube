import { useState, useEffect } from 'react';

const useFetch = (url: string) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    setIsLoading(true);
    setError(null);

    fetch(url, { signal })
      .then(response => {
        if (!response.ok) { 
          throw new Error('Could not fetch the data for that resource');
        } 
        return response.json();
      })
      .then(data => {
        setData(data);
        setIsLoading(false);
        setError(null);
      })
      .catch(err => {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted:', err.message);
          return;
        }
        setError(err.message);
        setIsLoading(false);
      });

    return () => {
      abortController.abort();
    };
  }, [url]);

  return { data, isLoading, error };
};

export default useFetch;
