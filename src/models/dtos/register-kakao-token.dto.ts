import { Expose } from "class-transformer";
import { IsDefined, IsString } from "class-validator";

export class RegisterKakaoTokenInput {
    
    @Expose()
    @IsDefined()
    @IsString()
    uid: string;

    @Expose()
    @IsDefined()
    @IsString()
    studentId: string;
}