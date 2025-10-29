import { StatusType, TicketType } from "../../../domain/entities";

interface CreateTicketDtoInterface {
    phoneOrigin: number;
    clientName: string;
    rate?: number;
    comment: string;
    ticketType: TicketType;
    parkingId: string;
    createdAt: number;
    status: StatusType;
}

export class CreateTicketDto {
    private constructor(public readonly createTicketDto: CreateTicketDtoInterface) {}

    static create(props: { [key: string]: any }): [string?, CreateTicketDto?] {
        const { phoneOrigin, clientName, rate, comment, ticketType, parkingId, createdAt } = props;
        const status = StatusType.created;
        if (
            !phoneOrigin ||
            !clientName ||
            !rate ||
            !comment ||
            !ticketType ||
            !parkingId ||
            !createdAt ||
            !status
        )
            return ["You're missing some property", undefined];

        return [
            undefined,
            new CreateTicketDto({
                phoneOrigin,
                clientName,
                rate,
                comment,
                ticketType,
                parkingId,
                createdAt,
                status,
            }),
        ];
    }
}
