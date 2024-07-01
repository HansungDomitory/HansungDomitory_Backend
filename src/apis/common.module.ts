import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Student } from "./students/entities/students.entity";
import { Notice } from "./notice/entities/notice.entity";
import { ScoreRecord } from "./scoreRecords/entities/scoreRecords.entity";
import { ApplyOut } from "./applyOut/entities/applyOut.entity";
import { ApplyOutService } from "./applyOut/applyOut.service";
import { NoticeService } from "./notice/notice.service";
import { ScoreRecordService } from "./scoreRecords/scoreRecords.service";
import { StudentService } from "./students/students.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Student,
            Notice,
            ScoreRecord,
            ApplyOut
        ]),
        JwtModule.register({}),
    ],
    providers: [
        ApplyOutService,
        NoticeService,
        ScoreRecordService,
        StudentService
    ],
    exports: [
        ApplyOutService,
        NoticeService,
        ScoreRecordService,
        StudentService
    ]
})
export class CommonModule {}