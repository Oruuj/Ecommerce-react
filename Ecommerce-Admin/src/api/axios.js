import axios from "axios";

export default axios.create({
    baseURL: "https://localhost:7279/api",
    headers: {
        "Content-Type": "application/json",
    },
});
