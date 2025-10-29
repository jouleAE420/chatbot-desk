import { CreateTicketDto, UpdateTicketDto } from "../../../domain/dtos";
import { TicketEntity } from "../../../domain/entities";

export abstract class TicketRepository {
    abstract saveTicket(createTicketDto: CreateTicketDto): Promise<TicketEntity>;
    abstract getById(ticketId: string): Promise<TicketEntity>;
    abstract updateTicket(
        ticketId: string,
        updateTicketDto: UpdateTicketDto
    ): Promise<TicketEntity>;
//    abstract getAll(): Promise<TicketEntity[]>;
 abstract getAll(page: number, limit: number): Promise<TicketEntity[]>;

}
