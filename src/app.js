import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/index.js";
import corsOptions from "./config/cors-options.js";
import { deptRoutes, authRoutes, roleRoutes, permissionRoutes } from "./routes/index.js";


const app = express();

//used for prasing request Bodies
app.use(express.json());
app.use(cors(corsOptions));

// used for parsing Cookies
app.use(cookieParser());


// for debugging (only dev env)..
app.use((req, res, next) => {
    console.log(req.url);
    next();
})

// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "http://localhost:4000")
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type")
//     res.setHeader("Access-Control-Allow-Credentials", "true")
//     next();
// })

app.use("/api/dept", deptRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/permission", permissionRoutes);


// express default error handing middleware
app.use(errorHandler);

export default app;

