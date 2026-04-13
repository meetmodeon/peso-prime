export interface ClientRequest {
  name: string;
  position?: string;
  companyName?: string;
  description?: string;
  companyLogoId?: number;
  clientImageId?: number;
}

export interface ClientResponse {
  id: number;
  name: string;
  position: string;
  companyName: string;
  description: string;
  companyLogoId: number;
  clientImageId: number;
}