import { Types } from "mongoose";

export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    picture: string;
    email: string;
    isConfirmed: boolean;
    contoCorrenteId?: string | Types.ObjectId;
}  