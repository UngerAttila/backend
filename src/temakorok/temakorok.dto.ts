import { IsNumber, IsString } from "class-validator";

export default class CreatetemakorokDto {
    @IsNumber()
    public _id: number;

    @IsNumber()
    public temakor: string;
}