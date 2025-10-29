import { Schema, model, Document } from "mongoose";

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

// Interfaz de documento de Mongoose que extiende Document
export interface TicketDocument extends Document {
    phoneOrigin: number;
    clientName: string;
    rate: number;
    comment: string;
    ticketType: TicketType;
    parkingId: Schema.Types.ObjectId;
    createdAt: number;
    status: StatusType;
    users: Schema.Types.ObjectId[];
}

// Definición del esquema de Mongoose
const TicketSchema = new Schema<TicketDocument>({
    phoneOrigin: { type: Number, required: true },
    clientName: { type: String, required: true },
    rate: { type: Number, required: true },
    comment: { type: String, required: true },
    ticketType: {
        type: String,
        enum: Object.values(TicketType),
        default: TicketType.other,
    },
    parkingId: { type: Schema.Types.ObjectId, ref: "parking" },
    createdAt: { type: Number, default: Date.now },
    status: {
        type: String,
        enum: Object.values(StatusType),
        required: true,
    },
    users: [{ type:Schema.Types.ObjectId, ref: "user" }],
});

// Crear el modelo
export const TicketModel = model<TicketDocument>("Ticket", TicketSchema);
