import { Router } from "express";

export interface BaseRouter {
    getRouter(): Router;
}