import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';
import { TutorialRepository } from './tutorial.repository';
import { TutorialEntity } from './entities/tutorial.entity';
import { FilterTutorialDto } from './dto/filter-tutorial.dto';
import { GetTutorialDto } from './dto/get-tutorial.dto';
import * as moment from 'moment';

@Injectable()
export class TutorialService {
  constructor(
    @Inject(TutorialRepository)
    private readonly tutorialRepository: TutorialRepository
  ) { }

  async findAll(filterTutorialDto: FilterTutorialDto): Promise<GetTutorialDto[]> {
    const tutorials = await this.tutorialRepository.findAll(filterTutorialDto)
    return tutorials.map((tutorial) => {
      return {
        id: tutorial.id,
        title: tutorial.title,
        createdAt: moment(tutorial.createdAt).toString(),
        updatedAt: moment(tutorial.updatedAt).toString(),
        user: tutorial.user?.name
      }
    })
  }

  async create(createTutorialDto: CreateTutorialDto, userId: number): Promise<TutorialEntity> {
    const tutorialByTitle = await this.tutorialRepository.findByTitle(createTutorialDto.title)
    if (tutorialByTitle) throw new HttpException('Tutorial already exists', HttpStatus.CONFLICT);
    return await this.tutorialRepository.create(createTutorialDto, userId)
  }

  async findOne(id: number, userId: number): Promise<GetTutorialDto> {
    const tutorial = await this.tutorialRepository.findByUser(id, userId);
    if (!tutorial) throw new NotFoundException()
    return {
      id: tutorial.id,
      title: tutorial.title,
      createdAt: moment(tutorial.createdAt).toString(),
      updatedAt: moment(tutorial.updatedAt).toString(),
      user: tutorial.user?.name
    }
  }

  async update(id: number, updateTutorialDto: UpdateTutorialDto, userId: number): Promise<TutorialEntity> {
    const tutorial = await this.tutorialRepository.findByUser(id, userId);
    if (!tutorial) throw new NotFoundException()
    return await this.tutorialRepository.update(tutorial, updateTutorialDto)
  }

  async remove(id: number, userId: number): Promise<void> {
    const tutorial = await this.tutorialRepository.findByUser(id, userId);
    if (!tutorial) throw new NotFoundException()
    return await this.tutorialRepository.delete(tutorial)
  }
}
