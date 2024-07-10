import { Module } from '@nestjs/common';
import { StudentModule } from './apis/students/students.module';
import { NoticeModule } from './apis/notice/notice.module';
import { ScoreRecordModule } from './apis/scoreRecords/scoreRecords.module';
import { ApplyOutModule } from './apis/applyOut/applyOut.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from './apis/notice/entities/notice.entity';
import { Student } from './apis/students/entities/students.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    StudentModule,
    NoticeModule,
    ScoreRecordModule,
    ApplyOutModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_INTERNAL_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [Notice, Student],
      synchronize: true,
      logging: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
