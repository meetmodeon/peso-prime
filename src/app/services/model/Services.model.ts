import { ServiceType } from "./FileType.model";

export interface ServiceResponse {
  id: number;
  title: string;
  type: ServiceType;
  description?: string;
  imageId?: number;
  processSteps: string[];
  equipments: string[];
  deliverables: string[];
}

export interface ServiceRequest {
  title: string;
  type: ServiceType;
  description?: string;
  imageId?: number;
  processSteps: string[];
  equipments: string[];
  deliverables: string[];
}