import { useState, useCallback } from "react";

// Base API configuration
const API_BASE_URL = "http://localhost:5000/api";

export const usePost = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = useCallback(async (url, body, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: JSON.stringify(body),
        ...options,
      });
      if (!res.ok || res.status == 400) {
        const err = await res.json();
        console.log(err);
        throw new Error(err.error);
      }
      const data = await res.json();
      setData(data);
      return data;
    } catch (error) {
      console.error(error);
      setError(`${error.message}`);
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);
  return { data, loading, error, postData };
};
