import { StatusFilter } from "./FileType.model";

export interface ProjectResponse {
  id: number;
  title: string;
  categoryTags: string;
  province: province;
  location: string;
  clientName: string;
  status: StatusFilter;
  description: string;
  scopeOfWork: string[];
  imageIds: number[];
  createdAt: string;
  updatedAt: string | null;
}
export type province= 'KOSHI' | 'BAGMATI' | 'GANDAKI' | 'LUMBINI' | 'KARNALI' | 'MADHESH' | 'SUDURPASHCHIM';