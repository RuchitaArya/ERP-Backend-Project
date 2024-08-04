import { Router } from "express";
import { catchAsync } from "../middlewares/index.js";
import { registerUser, login, getNewAccessTocken, logout } from "../controllers/index.js";

export const authRoutes = Router();

authRoutes.post("/register", catchAsync(registerUser));
authRoutes.post("/login", catchAsync(login));
authRoutes.get("/refresh", catchAsync(getNewAccessTocken));
authRoutes.post("/logout", catchAsync(logout));