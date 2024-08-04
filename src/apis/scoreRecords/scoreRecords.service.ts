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

    async create(myId: string, createScoreRecordInput: CreateScoreRecordInput) {
        if(!myId || myId !== '0000000') {
            throw new ForbiddenException('관리자만 상벌점 기록을 생성할 수 있습니다.');
        }

        const { student_id, ...rest } = createScoreRecordInput;
        const student = await this.studentService.findById(student_id);
        await this.studentService.addScore(student_id, createScoreRecordInput.is_merit, createScoreRecordInput.score);

        return await this.scoreRecordRepository.save({
            student,
            ...rest,
        });
    }

    async findById(myId: string, id: number): Promise<ScoreRecord> {
        if(!myId) {
            throw new ForbiddenException('로그인된 사용자만 상벌점 기록을 볼 수 있습니다.');
        }

        const result = await this.scoreRecordRepository.findOne({
            where: { id: id },
            relations: ['student']
        });

        if (myId === result.student.id || myId === '0000000') {
            return result;
        } else {
            throw new ForbiddenException('본인의 상벌점 기록만 볼 수 있습니다.');
        }
    }

    async findByStudentId(myId: string): Promise<ScoreRecord[]> {
        if(!myId) {
            throw new ForbiddenException('로그인된 사용자만 상벌점 기록을 볼 수 있습니다.');
        }

        const result = await this.scoreRecordRepository.find({
            where: { student: { id: myId } },
            order: { create_at: 'DESC' },
            relations: ['student']
        });

        return result;
    }

    async update(myId: string, id: number, updateScoreRecordInput: UpdateScoreRecordInput) {
        if(!myId || myId !== '0000000') {
            throw new ForbiddenException('관리자만 상벌점 기록을 수정할 수 있습니다.');
        }

        const nowScoreRecord = await this.findById(myId, id);
        console.log(nowScoreRecord.student.id, nowScoreRecord.is_merit, -nowScoreRecord.score);
        console.log(nowScoreRecord.student.id, updateScoreRecordInput.is_merit, updateScoreRecordInput.score);
        await this.studentService.addScore(nowScoreRecord.student.id, nowScoreRecord.is_merit, -nowScoreRecord.score);
        await this.studentService.addScore(nowScoreRecord.student.id, updateScoreRecordInput.is_merit, updateScoreRecordInput.score);

        await this.scoreRecordRepository.update(
            { id: id },
            { ...updateScoreRecordInput });
        return await this.findById(myId, id);
    }

    async delete(myId: string, id: number): Promise<boolean> {
        if(!myId || myId !== '0000000') {
            throw new ForbiddenException('관리자만 상벌점 기록을 삭제할 수 있습니다.');
        }

        const nowScoreRecord = await this.findById(myId, id);
        await this.studentService.addScore(nowScoreRecord.student.id, nowScoreRecord.is_merit, -nowScoreRecord.score);

        const result = await this.scoreRecordRepository.delete({ id: id });
        return result.affected > 0;
    }
}