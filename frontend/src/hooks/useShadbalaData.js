// frontend/src/hooks/useShadbalaData.js

import {
    useEffect,
    useState,
    useCallback
} from "react";

/**
 * Custom hook to fetch Shadbala data from the API.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useShadbalaData();
 *
 * Returns:
 *   data    {object|null}  - Parsed JSON from /api/shadbala
 *   loading {boolean}      - True while fetching
 *   error   {string|null}  - Error message if fetch failed
 *   refetch {function}     - Manually re-trigger the fetch
 */
export function useShadbalaData() {

    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    const fetchData = useCallback(() => {

        setLoading(true);
        setError(null);

        fetch("/api/shadbala")
            .then(r => {
                if (!r.ok) {
                    throw new Error(
                        `HTTP ${r.status}: ${r.statusText}`
                    );
                }
                return r.json();
            })
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message ?? "Failed to load Shadbala data");
                setLoading(false);
            });

    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}
