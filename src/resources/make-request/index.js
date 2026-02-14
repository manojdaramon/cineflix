/**
 * makeRequest — a reusable wrapper around fetch().
 *
 * Handles:
 *  - Setting JSON headers automatically
 *  - Injecting an auth token if provided
 *  - Parsing the JSON response
 *  - Throwing descriptive errors on failure
 *
 * @param {string} url - The API endpoint URL (absolute or relative).
 * @param {Object} [options={}] - Fetch options.
 * @param {string} [options.method="GET"] - HTTP method (GET, POST, PUT, DELETE).
 * @param {Object} [options.body] - Request body (will be JSON.stringified).
 * @param {Object} [options.headers] - Additional headers to merge in.
 * @param {string} [options.token] - Auth token to include in the Authorization header.
 * @returns {Promise<Object>} The parsed JSON response.
 *
 * @example
 * // GET request
 * const movies = await makeRequest("https://api.example.com/movies");
 *
 * @example
 * // POST request with auth
 * const result = await makeRequest("https://api.example.com/movies", {
 *     method: "POST",
 *     body: { title: "Inception", year: 2010 },
 *     token: "your-auth-token-here",
 * });
 */
const makeRequest = async (url, options = {}) => {
    const { method = "GET", body, headers = {}, token } = options;

    /** Build the headers object */
    const requestHeaders = {
        "Content-Type": "application/json",
        ...headers,
    };

    /** If a token is provided, attach it as a Bearer token */
    if (token) {
        requestHeaders["Authorization"] = `Bearer ${token}`;
    }

    /** Build the fetch config */
    const fetchConfig = {
        method,
        headers: requestHeaders,
    };

    /**
     * Only attach body for methods that support it.
     * GET and HEAD requests should NOT have a body.
     */
    if (body && method !== "GET" && method !== "HEAD") {
        fetchConfig.body = JSON.stringify(body);
    }

    /** Make the actual fetch call */
    const response = await fetch(url, fetchConfig);

    /**
     * If the response is not OK (status outside 200-299),
     * try to extract the error message from the response body.
     */
    if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;

        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
            // Response body wasn't JSON — use the default message
        }

        throw new Error(errorMessage);
    }

    /**
     * Some responses (like 204 No Content) won't have a body.
     * Return null for those cases.
     */
    if (response.status === 204) {
        return null;
    }

    return response.json();
};

export default makeRequest;
