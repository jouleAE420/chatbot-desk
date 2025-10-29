import { TicketEntity } from "../../../domain/entities";
import { UpdateTicketDto } from "../../../domain/dtos";
import { TicketRepository } from "../../../domain/repository";
import { CustomError } from "../../../domain/errors/custom.error";




export class UpdateTicketUseCase {
    constructor(private readonly ticketRepository: TicketRepository) {}

    async execute(id: string, updateDto: UpdateTicketDto) {
        const ticket = await this.ticketRepository.getById(id);
        if (!ticket) throw new CustomError(404, "Ticket not found");

        const existingUsers = ticket.users || [];
        const incomingUsers = updateDto.updateTicketDto.users;
        if (incomingUsers) {
            const usersToAdd = Array.isArray(incomingUsers) ? incomingUsers : [incomingUsers];
            const newUsers = usersToAdd.filter(u => !existingUsers.includes(u));
            if (newUsers.length) ticket.users = [...existingUsers, ...newUsers];
        }

        const { rate, comment, ticketType, status } = updateDto.updateTicketDto;
        if (rate !== undefined) ticket.rate = rate;
        if (comment !== undefined) ticket.comment = comment;
        if (ticketType !== undefined) ticket.ticketType = ticketType;
        if (status !== undefined) ticket.status = status;

        const dtoToUpdate = new UpdateTicketDto({
            rate: ticket.rate,
            comment: ticket.comment,
            ticketType: ticket.ticketType,
            status: ticket.status,
            users: ticket.users,
        });

        return this.ticketRepository.updateTicket(id, dtoToUpdate);
    }
}
