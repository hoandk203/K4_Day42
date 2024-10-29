export const client = {
    serverApi: import.meta.env.VITE_SERVER_API,
    token: null,

    send: async function (url, method = "GET", body = null, apiKey = null) {
        url = `${this.serverApi}${url}`;

        const headers = {
            "Content-Type": "application/json",
        };

        if (apiKey) {
            headers["X-Api-Key"] = apiKey;
        }

        if (this.token) {
            headers["Authorization"] = `Bearer ${this.token}`;
        }

        const options = {
            method,
            headers,
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        const data = await response.json();

        return { response, data };
    },

    get: function (url, apiKey) {
        return this.send(url, "GET", null, apiKey);
    },

    post: function (url, body, apiKey) {
        return this.send(url, "POST", body, apiKey);
    },

    put: function (url, body, apiKey) {
        return this.send(url, "PUT", body, apiKey);
    },

    patch: function (url, body, apiKey) {
        return this.send(url, "PATCH", body, apiKey);
    },

    delete: function (url, apiKey) {
        return this.send(url, "DELETE", null, apiKey);
    },
};
