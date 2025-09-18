export const TicketType = {
  complaint: "COMPLAINT",
  suggestion: "SUGGESTION",
  other: "OTHER",
} as const;
export type TicketType = typeof TicketType[keyof typeof TicketType];

export const StatusType = {
  created: "CREATED",
  pending: "PENDING",
  in_progress: "IN_PROGRESS",
  resolved: "RESOLVED",
} as const;
export type StatusType = typeof StatusType[keyof typeof StatusType];

export interface TicketOptions  {
  id: number;
  phoneOrigin: string;
  clientName: string;
  rate: number;
  comment: string;
  ticketType: TicketType;
  parkingId: string;
  createdAt: number;
  status: StatusType;
}