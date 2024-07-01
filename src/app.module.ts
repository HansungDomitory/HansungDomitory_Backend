import { Module } from '@nestjs/common';
import { StudentModule } from './apis/students/students.module';
import { NoticeModule } from './apis/notice/notice.module';
import { ScoreRecordModule } from './apis/scoreRecords/scoreRecords.module';
import { ApplyOutModule } from './apis/applyOut/applyOut.module';

@Module({
  imports: [
    StudentModule,
    NoticeModule,
    ScoreRecordModule,
    ApplyOutModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
