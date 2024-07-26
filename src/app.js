import express from "express";
import "dotenv/config";
import { deptRoutes, authRoutes, roleRoutes , permissionRoutes} from "./routes/index.js";
import { errorHandler } from "./middlewares/index.js";

const app = express();

//used for prasing request Bodies
app.use(express.json());

// for debugging (only dev env)..
app.use((req, res, next) => {
    console.log(req.url);
    // console.log(req.headers);
    next();
})
app.use("/api/dept", deptRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/role",roleRoutes);
app.use("/api/permission",permissionRoutes);


// express default error handing middleware
app.use(errorHandler);

export default app;

