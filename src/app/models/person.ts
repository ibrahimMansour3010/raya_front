import { Address } from "./address";

export interface Person {
    id:number,
    firstname:string,
    lastName:string,
    email:string,
    birthday:any,
    phone:string,
    gender:number,
    address:Address[]
}
