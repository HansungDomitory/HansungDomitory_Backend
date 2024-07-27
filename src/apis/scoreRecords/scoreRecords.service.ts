import { InjectRepository } from "@nestjs/typeorm";
import { ScoreRecord } from "./entities/scoreRecords.entity";
import { Repository } from "typeorm";
import { StudentService } from "../students/students.service";
import { ForbiddenException } from "@nestjs/common";
import { CreateScoreRecordInput } from "./dto/create-scoreRecord.input";
import { UpdateScoreRecordInput } from "./dto/update-scoreRecord.input";

export class ScoreRecordService {
    constructor(
        @InjectRepository(ScoreRecord)
        private readonly scoreRecordRepository: Repository<ScoreRecord>,
        private readonly studentService: StudentService
    ) {}

    async create(createScoreRecordInput: CreateScoreRecordInput, myId: string) {
        if(!myId && myId !== '0000000') {
            throw new ForbiddenException('관리자만 상벌점 기록을 생성할 수 있습니다.');
        }

        const { student_id, ...rest } = createScoreRecordInput;
        const student = await this.studentService.findById(student_id);

        return await this.scoreRecordRepository.save({
            student,
            ...rest,
        });
    }

    async findById(id: number, myId: string): Promise<ScoreRecord> {
        if(!myId && myId !== '0000000') {
            throw new ForbiddenException('관리자만 상벌점 기록을 볼 수 있습니다.');
        }

        const result = await this.scoreRecordRepository.findOne({
            where: { id: id },
            relations: ['student']
        });

        return result;
    }

    async findByStudentId(student_id: string, myId: string): Promise<ScoreRecord[]> {
        if(!myId && myId !== '0000000') {
            throw new ForbiddenException('관리자만 상벌점 기록을 볼 수 있습니다.');
        }

        const result = await this.scoreRecordRepository.find({
            where: { student: { id: student_id} },
            order: { create_at: 'DESC'},
            relations: ['student']
        });

        return result;
    }

    async update(updateScoreRecordInput: UpdateScoreRecordInput, myId: string) {
        if(!myId && myId !== '0000000') {
            throw new ForbiddenException('관리자만 상벌점 기록을 수정할 수 있습니다.');
        }

        const { id, ...rest } = updateScoreRecordInput;
        await this.scoreRecordRepository.update(
            { id: id },
            { ...rest });
        return await this.findById(id, myId);
    }

    async delete(id: number, myId: string): Promise<boolean> {
        if(!myId && myId !== '0000000') {
            throw new ForbiddenException('관리자만 상벌점 기록을 삭제할 수 있습니다.');
        }

        const result = await this.scoreRecordRepository.delete({ id: id });
        return result.affected > 0;
    }
}