import { IsNumber, IsString } from "class-validator";

export default class CreatekerdesekDto {
    @IsNumber()
    public _id: number;

    @IsString()
    public kerdes: string;

    @IsNumber()
    public valasz: number;

    @IsNumber()
    public pont: number;

    @IsNumber()
    public temakor: number;
}
