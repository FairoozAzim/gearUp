import { Role } from "../../../generated/prisma/enums";

export interface RegisterUserPayload { 
     name: string,
     email: string,
     password : string,
     role? : Extract<Role, "CUSTOMER" | "PROVIDER">
}

export interface ILoginUser {

    email : string,
    password: string

}