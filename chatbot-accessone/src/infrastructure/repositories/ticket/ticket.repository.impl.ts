import { TicketDatasource } from "../../../domain/datasources";
import { CreateTicketDto, UpdateTicketDto } from "../../../domain/dtos";
import { TicketEntity } from "../../../domain/entities";
import { TicketRepository } from "../../../domain/repository";

export class TicketRepositoryImpl implements TicketRepository {
    constructor(private readonly ticketDatasource: TicketDatasource) {}
    saveTicket(createTicketDto: CreateTicketDto): Promise<TicketEntity> {
        return this.ticketDatasource.saveTicket(createTicketDto);
    }
    getById(ticketId: string): Promise<TicketEntity> {
        return this.ticketDatasource.getById(ticketId);
    }
    updateTicket(ticketId: string, updateTicketDto: UpdateTicketDto): Promise<TicketEntity> {
        return this.ticketDatasource.updateTicket(ticketId, updateTicketDto);
    }
  getAll(page: number, limit: number): Promise<TicketEntity[]> {
    return this.ticketDatasource.getAll(page, limit);
}
}
