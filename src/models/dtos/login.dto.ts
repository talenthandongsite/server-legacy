import { Expose } from "class-transformer";
import { IsDefined } from "class-validator";

export class LoginInput { 
    
    @Expose()
    @IsDefined()
    uid: string;
}