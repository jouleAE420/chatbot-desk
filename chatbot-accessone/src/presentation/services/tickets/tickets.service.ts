import { CreateTicketDto, UpdateTicketDto } from "../../../domain/dtos";
import { TicketRepository } from "../../../domain/repository";
import { UpdateTicketUseCase } from "../../../domain/use-cases/tickets/update-ticket.use-case";

export class TicketService {
    constructor(private readonly ticketRepository: TicketRepository) {}

    public async getTicketById(ticketId: string) {
        return await this.ticketRepository.getById(ticketId);
    }

    public async getAllTickets() {
        return await this.ticketRepository.getAll();
    }

    public async createTicket(data: any) {
        data.createdAt = Date.now();

        const [error, createTicketDto] = CreateTicketDto.create(data);
        if (error || !createTicketDto) throw new Error(error ?? "Datos inválidos para crear ticket");

        return await this.ticketRepository.saveTicket(createTicketDto);
    }

    public async updateTicket(id: string, data: any) {
        const [error, updateTicketDto] = UpdateTicketDto.update(data);
        if (error || !updateTicketDto)
            throw new Error(error ?? "Datos inválidos para actualizar ticket");

        const useCase = new UpdateTicketUseCase(this.ticketRepository);
        return await useCase.execute(id, updateTicketDto);
    }
}