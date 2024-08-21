import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The username of the auth',
        example: 'user.new',
    })
    username: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The password of the auth',
        example: 'process',
    })
    password: string;
}
