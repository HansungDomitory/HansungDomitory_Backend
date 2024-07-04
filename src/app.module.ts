import { Module } from '@nestjs/common';
import { StudentModule } from './apis/students/students.module';
import { NoticeModule } from './apis/notice/notice.module';
import { ScoreRecordModule } from './apis/scoreRecords/scoreRecords.module';
import { ApplyOutModule } from './apis/applyOut/applyOut.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from './apis/notice/entities/notice.entity';
import { Student } from './apis/students/entities/students.entity';

@Module({
  imports: [
    StudentModule,
    NoticeModule,
    ScoreRecordModule,
    ApplyOutModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'test',
      database: 'domitory',
      entities: [Notice, Student],
      synchronize: true,
      logging: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
