import { useState, useCallback } from "react";

// Base API configuration
const API_BASE_URL = "http://localhost:5000/api";

export const usePost = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = useCallback(
    async (url, body, token = null, options = {}) => {
      try {
        setLoading(true);
        setError(null);

        const headers = {
          "Content-Type": "application/json",
          ...options.headers,
        };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch(`${API_BASE_URL}${url}`, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
          ...options,
        });

        if (!res.ok) {
          const err = await res.json();
          console.log(err);
          throw new Error(err.error || err.message || "Request failed");
        }

        const responseData = await res.json();
        setData(responseData);
        return responseData;
      } catch (error) {
        console.error(error);
        setError(error.message);
        throw new Error(error.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, loading, error, postData };
};
