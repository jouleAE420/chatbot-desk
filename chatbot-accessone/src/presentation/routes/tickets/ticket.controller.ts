import { Request, Response, RequestHandler } from "express";
import { TicketService } from "../../services";
import { TicketRepository } from "../../../domain/repository";

export class TicketController {
    constructor(private readonly ticketService: TicketService) {}
    public getById: RequestHandler = async (req: Request, res: Response) => {
        const { ticketId } = req.params;

        try {
            const ticket = await this.ticketService.getTicketById(ticketId);
            return res.json(ticket);
        } catch (error) {
            return res.status(400).json({ error: (error as Error).message });
        }
    };

    public getAll: RequestHandler = async (_req: Request, res: Response) => {
        try {
            const tickets = await this.ticketService.getAllTickets();
            return res.json(tickets);
        } catch (error) {
            return res.status(400).json({ error: (error as Error).message });
        }
    };

    public createTicket: RequestHandler = async (req: Request, res: Response) => {
        try {
            const ticket = await this.ticketService.createTicket(req.body);
            return res.json(ticket);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    };

    public updateTicket: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const ticket = await this.ticketService.updateTicket(id, req.body);
            return res.json(ticket);
        } catch (error) {
            return res.status(400).json({ error: (error as Error).message });
        }
    };
}
