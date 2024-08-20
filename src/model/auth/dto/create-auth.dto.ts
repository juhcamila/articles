import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateAuthDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The username of auth',
        example: 'teddy',
    })
    @Length(6)
    username: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The password of auth',
        example: 'process',
    })
    @Length(6)
    password: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The name of user',
        example: 'process',
    })
    name: string;
}
