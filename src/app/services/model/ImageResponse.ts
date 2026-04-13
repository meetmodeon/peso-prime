export interface ImageResponse{
    id:number;
    filePath:string;
    fileName:string;
}
export interface ImageType{
     type:'TEAM_MEMBERS_IMAGES'|'PROJECTS_IMAGES'|'SERVICES_IMAGES';
}