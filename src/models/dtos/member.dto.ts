import { Expose } from "class-transformer";
import { IsEmail, IsString, MaxLength } from "class-validator";
import { DATA_LENGTH } from "../enums";


// 관리자가 업데이트를 할 때 
export class UpdateMemberInput {
    @Expose()
    @IsString()
    @MaxLength(DATA_LENGTH.REGISTER_STATE)
    registerState: string;

    @Expose()
    @IsString()
    @MaxLength(DATA_LENGTH.NICKNAME)
    nickname: string;

    @Expose()
    @IsEmail()
    @MaxLength(DATA_LENGTH.EMAIL)
    email: string;

    @Expose()
    @IsString()
    @MaxLength(DATA_LENGTH.MEMO)
    memo: string;
}