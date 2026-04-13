export interface ProvenceChartResponse{
    name:string;
    projectNo:number;
}

export interface PortfolioDashboardResponse{
    provenceChartResponses:ProvenceChartResponse[];
    totalProject:number,
    totalTeamMember:number;
    totalServices:number
}