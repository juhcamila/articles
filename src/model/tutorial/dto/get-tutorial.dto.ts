import { ApiProperty } from '@nestjs/swagger';

export class GetTutorialDto {
  @ApiProperty({
    description: 'The id of the tutorial',
    example: 17,
  })
  id: number;

  @ApiProperty({
    description: 'The title of the tutorial',
    example: 'redis installation j',
  })
  title: string;

  @ApiProperty({
    description: 'The creation timestamp of the tutorial',
    example: '2024-08-21T01:44:08.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'The last update timestamp of the tutorial',
    example: '2024-08-21T01:44:08.000Z',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'The user associated with the tutorial',
    example: "Maria"
  })
  user: string;
}