import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class FilterTutorialDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'The title of the filter tutorial',
        example: 'redis',
        required: false
    })
    title: string;

    @IsDateString()
    @IsOptional()
    @ApiProperty({
        description: 'The date of the filter tutorial',
        example: '2024-08-20',
        required: false
    })
    date: Date;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    @ApiProperty({
        description: 'The limit of the pagination tutorial',
        example: 10,
        required: false
    })
    limit: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    @ApiProperty({
        description: 'The page of the pagination tutorial',
        example: 1,
        required: false
    })
    page: number;
}