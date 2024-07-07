import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Student } from "./entities/students.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { IContext, IStudentContext, IStudentServiceCreate, IStudentServiceUpdate } from "./interfaces/student-service.interface";
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
        private jwtService: JwtService,
    ) {}
    
    //회원가입
    async create({ createStudentInput }: IStudentServiceCreate): Promise<Student> {
        const existStudent = await this.findById(createStudentInput.id);
        if(existStudent != null) {
            throw new BadRequestException('이미 가입된 사용자입니다.');
        }

        const { password, ...rest} = createStudentInput;
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.studentRepository.save({
            password: hashedPassword,
            ...rest,
        });
    }

    //학생 정보 수정
    async update(
        student_id: string,
        { updateStudentInput }: IStudentServiceUpdate,
    ): Promise<Student> {
        //비밀번호 hash
        if(updateStudentInput.password) {
            const hashedPassword = await bcrypt.hash(updateStudentInput.password, 10);
            updateStudentInput.password = hashedPassword;
        }

        await this.studentRepository.update(student_id, updateStudentInput);
        return await this.findById(student_id);
    }

    //회원 정보 삭제
    async delete(student_id: string): Promise<boolean> {
        const student = await this.findById(student_id);
        if(student_id !== student.id) {
            throw new ForbiddenException(
                '현재 로그인 된 계정으로만 삭제할 수 있습니다.'
            );
        }
        const result = await this.studentRepository.delete({ id: student_id});
        return result.affected > 0;
    }

    async findAll(): Promise<Student[]> {
        return await this.studentRepository.find({
            order: {create_at: 'DESC' },
        })
    }

    async findById(student_id: string): Promise<Student> {
        return await this.studentRepository.findOne({
            where: { id: student_id },
        })
    }

    //JWT Token 생성
    getAccessToken(student: Student | IStudentContext['student']): string {
        return this.jwtService.sign(
            { sub: student.id },
            { secret: 'access_test', expiresIn: '10m' }
        );
    }

    //JWT Token 만료 대비 refresh Token 생성
    getRefreshToken(student: Student, context: IContext): void {
        const refreshToken = this.jwtService.sign(
            { sub: student.id },
            { secret: 'refresh_test', expiresIn: '2w' },
        );

        context.res.setHeader(
            'set-cookie',
            `refreshToken=${refreshToken}; path=/;`,
        );
    }

    //JWT Token 재발급
    getRestoreToken(student: IStudentContext['student']): string {
        return this.getAccessToken(student);
    }    
}