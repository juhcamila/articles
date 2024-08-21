import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { getSequelizeConfig } from './database/mysql';
import { AuthMiddleware } from './model/auth/auth.middleware';
import { AuthModule } from './model/auth/auth.module';
import { TutorialModule } from './model/tutorial/tutorial.module';
import { TutorialController } from './model/tutorial/tutorial.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getSequelizeConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    TutorialModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(TutorialController)
  }
}
