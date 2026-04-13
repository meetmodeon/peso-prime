import { catchError, map, OperatorFunction, throwError } from "rxjs";
import { ApiResponse } from "../../services/model/ApiResponse.model";

export function handleApiResponse<T>():OperatorFunction<ApiResponse<T>,T>{
    return (source$)=>
        source$.pipe(
            map((res)=>{
                if(res.success) return res.data;
                throw new Error(res.message);
            }),
            catchError((error)=>{
                let errorMessage='Something went wrong';

                if(error?.error?.message){
                    errorMessage=error.error.message;
                }else if(error.message){
                    errorMessage=error.message;
                }

                return throwError(()=>new Error(errorMessage));
            })
        )
}

export function getExpirenceYear():number{
    const currentYear=new Date().getFullYear();
    return currentYear-2001;
}