import { Expose } from 'class-transformer';
import { IsDefined, IsString } from 'class-validator';

export class VerifyHisnetInput {
    
    @Expose()
    @IsDefined()
    @IsString()
    id: string;

    @Expose()
    @IsDefined()
    @IsString()
    pw: string;
}