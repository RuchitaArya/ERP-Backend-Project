import { Router } from "express";
import { catchAsync } from "../middlewares/index.js";
import { login } from "../controllers/index.js";

export const authRoutes =Router();


authRoutes.post("/login", catchAsync (login));