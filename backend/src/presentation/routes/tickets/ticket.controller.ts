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

 public getAll: RequestHandler = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;

    if (isNaN(Number(page)) || isNaN(Number(limit))) {
        return res.status(400).json({ error: 'Page and limit must be valid numbers' });
    }

    try {
        console.log('🔍 Fetching tickets with page:', page, 'limit:', limit);
        const tickets = await this.ticketService.getAllTickets(Number(page), Number(limit));
        console.log('📦 Tickets found:', tickets); // <- AGREGA ESTO
        console.log('📊 Tickets count:', tickets?.length || 0); // <- Y ESTO
        return res.json(tickets);
    } catch (error) {
        console.error('❌ Error:', error); // <- Y ESTO
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
