import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateAuthDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The username of the auth',
        example: 'user.new',
    })
    @Length(6)
    username: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The password of the auth',
        example: 'process',
    })
    @Length(6)
    password: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The name of the user',
        example: 'Maria',
    })
    name: string;
}
