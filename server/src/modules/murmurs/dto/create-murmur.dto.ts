import { IsNotEmpty, IsString } from "class-validator";

export class CreateMurmurDto {
    @IsString()
    @IsNotEmpty()
    text: string;
}
