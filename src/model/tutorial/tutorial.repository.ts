import { Injectable } from "@nestjs/common";
import { TutorialEntity } from "./entities/tutorial.entity";
import { InjectModel } from "@nestjs/sequelize";
import { CreateTutorialDto } from "./dto/create-tutorial.dto";
import { UpdateTutorialDto } from "./dto/update-tutorial.dto";
import { FilterTutorialDto } from "./dto/filter-tutorial.dto";
import { Op } from 'sequelize';
import * as moment from 'moment'
import { UserEntity } from "../auth/entities/auth.entity";

@Injectable()
export class TutorialRepository {
    constructor(
        @InjectModel(TutorialEntity)
        private readonly tutorialEntity: typeof TutorialEntity
    ) { }

    async findAll(filter: FilterTutorialDto): Promise<TutorialEntity[]> {
        const limit: number = Number(filter.limit) || 10
        const offset: number = filter.page && filter.page !== 0 ? Number((filter.page - 1)) * limit : 0

        let conditions = {}
        if (filter.title) conditions['title'] = { [Op.like]: `%${filter.title}%` }
        if (filter.date) {
            const date = moment.utc(filter.date)
            const endDate = moment.utc(filter.date).endOf('day')

            conditions[Op.or] = [
                { createdAt: { [Op.between]: [date, endDate] } },
                { updatedAt: { [Op.between]: [date,endDate] } }
            ];
        }
        return await this.tutorialEntity.findAll({
            attributes: ['id', 'title', 'createdAt', 'updatedAt'],
            include: [{
                model: UserEntity,
                as: 'user',
                attributes: ['name']
            }],
            where: conditions,
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            raw: true
        })
    }

    async findByUser(id: number, userId: number): Promise<TutorialEntity> {
        return await this.tutorialEntity.findOne({
            attributes: ['id', 'title', 'createdAt', 'updatedAt'],
            include: [{
                model: UserEntity,
                as: 'user',
                attributes: ['name']
            }],
            where: {
                id,
                user_id: userId
            }
        })
    }

    async findByTitle(title: string): Promise<TutorialEntity> {
        return await this.tutorialEntity.findOne({
            where: {
                title
            }
        })
    }

    async create(createTutorialDto: CreateTutorialDto, userId: number): Promise<TutorialEntity> {
        return await TutorialEntity.create(<TutorialEntity>{
            ...createTutorialDto,
            user_id: userId
        })
    }

    async update(tutorial: TutorialEntity, updateTutorialDto: UpdateTutorialDto): Promise<TutorialEntity> {
        return await tutorial.update({
            ...updateTutorialDto
        })
    }

    async delete(tutorial: TutorialEntity): Promise<void> {
        return await tutorial.destroy()
    }
}