import { allowedOrigins } from "./allowed-origins.js";

const corsOptions = {
    origin: (origin, callback) => {
        console.log(origin);
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not alloowed by CORS"));
        }
    },
    Credential:true,
};

export default corsOptions;