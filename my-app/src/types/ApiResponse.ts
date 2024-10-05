import {UserFilter} from "@/app/model/User";

export interface ApiResponse {
    success:boolean;
    userfilters?:Array<UserFilter>
    message:string;
}