export interface TeamMemberRequest {
  name: string;
  qualifications: string;
  phone?: string;
  association: string;
  yearOfExperience: number;
  design: string;
  bio?: string;
  imageId?: number;
  selectedFile?:File
}

export interface TeamMemberResponse {
  id: number;
  name: string;
  qualifications: string;
  phone?: string;
  association: string;
  yearOfExperience: number;
  design: string;
  bio?: string;
  imageId?: number|null;
}