import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ApplyOut } from "./entities/applyOut.entity";
import { Repository } from "typeorm";
import { CreateApplyOutInput } from "./dto/create-applyOut.input";
import { UpdateApplyOutInput } from "./dto/update-applyOut.input";
import { StudentService } from "../students/students.service";

@Injectable()
export class ApplyOutService {   
    constructor(
        @InjectRepository(ApplyOut)
        private readonly applyOutRepository: Repository<ApplyOut>,
        private readonly studentService: StudentService
    ) {}

    //외박 신청
    async create(student_id: string, createApplyOutInput: CreateApplyOutInput): Promise<ApplyOut> {
        if(!student_id) {
            throw new ForbiddenException(
                '로그인 된 사용자만 외박신청이 가능합니다.'
            );
        }

        const { start_date, end_date, ...rest } = createApplyOutInput;
        const student = await this.studentService.findById(student_id);
        const new_start_date = new Date(start_date);
        const new_end_date = new Date(end_date);

        //외박일수 계산
        const duration = this.calculateDuration(new_start_date, new_end_date);

        //신청하기 버튼 누르면 저장되는 그거
        return await this.applyOutRepository.save({
            student,
            start_date: new_start_date,
            end_date: new_end_date,
            duration,
            ...rest,
        });      
    }

    //나의 모든 외박 신청 조회
    async findByStudentId(student_id: string): Promise<ApplyOut[]> {
        if(!student_id) {
            throw new ForbiddenException(
                '로그인 된 사용자만 외박신청 조회가 가능합니다.'
            );
        }

        const result = await this.applyOutRepository.find({
            where: { student: { id: student_id } },
            order: { create_at: 'DESC' },
            relations: ['student']
        });

        console.log(result);
        return result;
    }

    //특정 외박 신청 조회
    async findById(student_id: string, id: number): Promise<ApplyOut> {
        const applyOut = await this.applyOutRepository.findOne({ where: { id }, relations: ['student'] });
        
        if(applyOut.student.id !== student_id) {
            throw new ForbiddenException(
                '로그인 된 사용자의 외박신청만 조회가 가능합니다.'
            );
        }

        return applyOut;
    }

    //외박 신청 수정
    async update(student_id: string, id: number, updateApplyOutInput: UpdateApplyOutInput): Promise<ApplyOut> {
        const { start_date, end_date, ...rest } = updateApplyOutInput;
        const new_start_date = new Date(start_date);
        const new_end_date = new Date(end_date);

        const applyOut = await this.findById(student_id, id);
        
        if(applyOut.student.id !== student_id) {
            throw new ForbiddenException(
                '로그인 된 사용자의 외박신청만 수정이 가능합니다.'
            );
        }

        const duration = this.calculateDuration(new_start_date, new_end_date)

        await this.applyOutRepository.update(id, {
            start_date: new_start_date,
            end_date: new_end_date,
            duration,
            ...rest
        });
        return await this.findById(student_id, id);
    }

    //외박 신청 삭제
    async delete(student_id: string, id: number): Promise<boolean> {
        const applyOut = await this.findById(student_id, id);
        
        if(applyOut.student.id !== student_id) {
            throw new ForbiddenException(
                '로그인 된 사용자의 외박신청만 삭제가 가능합니다.'
            );
        }

        const result = await this.applyOutRepository.delete({ id });
        return result.affected > 0;
    }

    //외박일수 계산하는 함수
    private calculateDuration(start_date: Date, end_date: Date): number {
        const start = new Date(start_date);
        const end = new Date(end_date);
        const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        return Math.max(duration, 0); //음수가 되지 않도록..
    }
}