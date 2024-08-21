import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseInterceptors, Query, ValidationPipe } from '@nestjs/common';
import { TutorialService } from './tutorial.service';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';
import { UserDto } from '../user/dto/user.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { FilterTutorialDto } from './dto/filter-tutorial.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('tutorial')
@ApiTags('Tutorials')
export class TutorialController {
  constructor(private readonly tutorialService: TutorialService) {}

  @Post()
  @ApiOperation({ summary: 'Create tutorial' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 201, description: 'tutorial created' })
  async create(@Body(new ValidationPipe()) createTutorialDto: CreateTutorialDto, @Req() req: { user: UserDto}) {
    return await this.tutorialService.create(createTutorialDto, req.user.id);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get all tutorial with pagination and filters' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'List tutorials' })
  async findAll(@Query(new ValidationPipe()) query: FilterTutorialDto) {
    return await this.tutorialService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tutorial by id' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'find tutorial' })
  findOne(@Param('id') id: string, @Req() req: { user: UserDto}) {
    return this.tutorialService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update tutorial by id' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'Tutorial updated' })
  async update(@Param('id') id: string, @Body(new ValidationPipe()) updateTutorialDto: UpdateTutorialDto, @Req() req: { user: UserDto}) {
    return await this.tutorialService.update(+id, updateTutorialDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tutorial by id' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'tutorial deleted' })
  async remove(@Param('id') id: string, @Req() req: { user: UserDto}) {
    return await this.tutorialService.remove(+id, req.user.id);
  }
}
