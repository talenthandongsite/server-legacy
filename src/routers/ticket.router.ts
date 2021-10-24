import { Router } from "express";
import { BaseRouter } from "../models/bases";
import { Ticket } from '../models/entities';
import { Repository } from 'typeorm';

export class TicketRouter implements BaseRouter {
    router: Router = Router();

    constructor(private ticketRepository: Repository<Ticket>) {
        
    }

    getRouter(): Router {
        return this.router;
    }
}