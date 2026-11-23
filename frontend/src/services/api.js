import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    timeout: 180000,
});


api.interceptors.request.use((config) => {
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API RESPONSE ERROR:", error);
        return Promise.reject(error);
    }
);

export default api;