import { TicketModel } from "../../../data/mongo";
import { TicketDatasource } from "../../../domain/datasources";
import { CreateTicketDto, UpdateTicketDto } from "../../../domain/dtos";
import { TicketEntity } from "../../../domain/entities";


export class TicketParkingDatasourceMongo implements TicketDatasource {
    async saveTicket(createTicketDto: CreateTicketDto): Promise<TicketEntity> {
        const ticket = new TicketModel(createTicketDto.createTicketDto);
        await ticket.save();
        return TicketEntity.fromObject(ticket);
    }
    async getById(ticketId: string): Promise<TicketEntity> {
        const ticket = await TicketModel.findById(ticketId);
        if (!ticket) throw new Error("Ticket not found");
        return TicketEntity.fromObject(ticket);
    }
    async updateTicket(ticketId: string, updateTicketDto: UpdateTicketDto): Promise<TicketEntity> {
        const ticket = await TicketModel.findByIdAndUpdate(ticketId, updateTicketDto.values, { new: true });
        if (!ticket) throw new Error("Ticket not found");
        return TicketEntity.fromObject(ticket);
    }
 async getAll(page: number, limit: number): Promise<TicketEntity[]> {
    const skip = (page - 1) * limit;
    const tickets = await TicketModel.find()
        .skip(skip)
        .limit(limit)
        .exec();
    return tickets.map(ticket => TicketEntity.fromObject(ticket));
}

}
