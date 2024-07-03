import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Student } from "./entities/students.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { IContext, IStudentContext, IStudentServiceCreate, IStudentServiceUpdate } from "./interfaces/student-service.interface";

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
        const student = await this.studentRepository.save({
            password: hashedPassword,
            ...rest,
        });
    }

    //학생 정보 수정
    async update(
        student_id: string,
        { updateStudentInput }: IStudentServiceUpdate,
    ): Promise<Student> {
        let result = null;
        const student = await this.findById(student_id);
        const { ...rest } = updateStudentInput;

        //비밀번호 hash
        if(rest.password) {
            const hashedPassword = await bcrypt.hash(rest.password, 10);
            rest.password = hashedPassword;
        }

        if(result.affected > 0) {
            return await this.findById(student_id);
        }
        else {
            return null;
        }
    }

    //회원 정보 삭제
    async delete(student_id: string): Promise<boolean> {
        const student = await this.findById(student_id);
        if(student_id !== student_id) {
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
            { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '10m' }
        );
    }

    //JWT Token 만료 대비 refresh Token 생성
    getRefreshToken(student: Student, context: IContext): void {
        const refreshToken = this.jwtService.sign(
            { sub: student.id },
            { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '2w' },
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