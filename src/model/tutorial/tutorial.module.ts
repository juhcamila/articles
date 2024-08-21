import { Module } from '@nestjs/common';
import { TutorialService } from './tutorial.service';
import { TutorialController } from './tutorial.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TutorialEntity } from './entities/tutorial.entity';
import { TutorialRepository } from './tutorial.repository';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    SequelizeModule.forFeature([TutorialEntity]),
    CacheModule.register({
      ttl: 60000,
      max: 50,
    })   
  ],
  controllers: [TutorialController],
  providers: [
    TutorialService,
    TutorialRepository
  ],
})
export class TutorialModule {}
