import { QueryStatus } from "./FileType.model";

export interface ContactQueryRequest {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  subject: string;
  message: string;
}

export interface ContactQueryResponse {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  subject: string;
  message: string;
  status: QueryStatus;
  adminReply:string;
  createdAt:string;
}
export interface UpdateQueryStatusRequest{
    id:number,
    queryStatus:QueryStatus
}
export interface AdminReplyRequest{
    message:string
}