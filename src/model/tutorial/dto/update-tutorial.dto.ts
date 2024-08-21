import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class UpdateTutorialDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The title of the tutorial',
        example: 'redis#installation',
    })
    @Length(6, 200)
    title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The content of the tutorial',
        example: 'npm i --save ioredis',
    })
    content: string;
}
