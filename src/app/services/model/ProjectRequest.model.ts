import { StatusFilter } from "./FileType.model";
import {  province } from "./ProjectResponse.model";

export interface ProjectRequest {
  title: string;
  categoryTags: string;
  province: province;
  location: string;
  clientName: string;
  status: StatusFilter;
  description?: string;
  scopeOfWork?: string[];
  imageIds?: number[];
}

