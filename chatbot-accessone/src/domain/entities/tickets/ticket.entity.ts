export enum TicketType {
    complaint = "COMPLAINT",
    suggestion = "SUGGESTION",
    other = "OTHER",
}
export enum StatusType {
    created = "CREATED",
    pending = "PENDING",
    in_progress = "IN_PROGRESS",
    resolved = "RESOLVED",
}

export interface TicketOptions {
    phoneOrigin: number;
    clientName: string;
    rate: number;
    comment: string;
    ticketType: TicketType;
     parkingId: string;
    createdAt: number;
    status: StatusType;
    users?: string[];
}

export class TicketEntity {
    public phoneOrigin: number;
    public clientName: string;
    public rate: number;
    public comment: string;
    public parkingId: string;
    public ticketType: TicketType;
    public createdAt: number;
    public status: StatusType;
    public users?: string[];


    constructor(options: TicketOptions) {
        const {
            phoneOrigin,
            clientName,
            rate,
            comment,
            ticketType = TicketType.other,
            createdAt = Date.now(),
            status,
            parkingId,
            users,
        } = options;
        this.phoneOrigin = phoneOrigin;
        this.clientName = clientName;
        this.rate = rate;
        this.comment = comment;
        this.ticketType = ticketType;
        this.parkingId = parkingId;
        this.createdAt = createdAt;
        this.status = status;
        this.users = users;
    }

    static fromJson = (json: string): TicketEntity => {
        const {
            phoneOrigin,
            clientName,
            rate,
            comment,
            ticketType,
            parkingId,
            createdAt,
            status,
            users
        } = JSON.parse(json);
        const ticket = new TicketEntity({
            users,
            createdAt,
            parkingId,
            phoneOrigin,
            clientName,
            rate,
            comment,
            ticketType,
            status,
        });
        return ticket;
    };

    static fromObject = (object: { [key: string]: any }): TicketEntity => {
        const {
            phoneOrigin,
            clientName,
            rate,
            comment,
            ticketType,
            parkingId,
            createdAt,
            status,
            users,
        } = object;

        const ticket = new TicketEntity({
            users,
            phoneOrigin,
            clientName,
            rate,
            comment,
            ticketType,
            parkingId,
            createdAt,
            status,
        });
        return ticket;
    };
}
