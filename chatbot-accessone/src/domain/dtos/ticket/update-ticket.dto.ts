import { StatusType, TicketType } from "../../../domain/entities";

interface UpdateTicketDtoInterface {
    rate?: number;
    comment?: string;
    ticketType?: TicketType;
    status?: StatusType;
    users?: string[];
}

export class UpdateTicketDto {
    constructor(
        public updateTicketDto: UpdateTicketDtoInterface
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.updateTicketDto.rate) returnObj.rate = this.updateTicketDto.rate;
        if (this.updateTicketDto.comment) returnObj.comment = this.updateTicketDto.comment;
        if (this.updateTicketDto.ticketType) returnObj.ticketType = this.updateTicketDto.ticketType;
        if (this.updateTicketDto.status) returnObj.status = this.updateTicketDto.status;
        if (this.updateTicketDto.users) returnObj.users = this.updateTicketDto.users;
        return returnObj;
    }

    static update(props: { [key: string]: any }): [string?, UpdateTicketDto?] {
        const { rate, comment, ticketType, status, users } = props;
        return [undefined, new UpdateTicketDto({ rate, comment, ticketType, status, users })];
    }
}
