import { Injectable } from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UserEntity } from "./entities/auth.entity";

@Injectable()
export class AuthRepository {
    constructor() { }

    async create(body: CreateAuthDto): Promise<UserEntity> {
        return await UserEntity.create(<CreateAuthDto>{
            username: body.username,
            name: body.username,
            password: body.password
        })
    }

    async findByUsername(username: string): Promise<UserEntity> {
        return await UserEntity.findOne({
            where: {
                username
            },
            raw: true
        })
    }
}