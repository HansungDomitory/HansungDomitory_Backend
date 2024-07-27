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

        if(createStudentInput.id === '0000000') {
            throw new BadRequestException('회원가입할 수 없는 ID입니다.');
        }

        const { password, ...rest} = createStudentInput;
        const hashedPassword = await bcrypt.hash(password, 10);
        const room = await this.assignRandomRoom();

        return this.studentRepository.save({
            password: hashedPassword,
            room,
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
            { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '100m' }
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

    async addScore(student_id: string, isMeritScore: boolean, score: number) {
        const student = await this.studentRepository.findOne({ where: { id: student_id } });
        const nowMeritScore = student.merit_score;
        const nowDemeritScore = student.demerit_score;

        if (isMeritScore) {
            await this.studentRepository.update(
                { id: student_id },
                { merit_score:  nowMeritScore + score }
            )
        } else {
            await this.studentRepository.update(
                { id: student_id },
                { demerit_score: nowDemeritScore + score }
            )
        }
        return await this.findById(student_id);
    }

    // 사용되지 않은 랜덤 방 번호 배정
    private async assignRandomRoom(): Promise<string> {
        const existingRooms = await this.studentRepository.find({ select: ['room'] });
        const existingRoomSet = new Set(existingRooms.map(student => student.room));

        while (true) {
            const randomRoom = this.generateRandomRoom();
            if (!existingRoomSet.has(randomRoom)) {
                return randomRoom;
            }
        }
    }

    // 랜덤 방 번호 생성
    private generateRandomRoom(): string {
        const floor = this.getRandomInt(1, 9);
        const roomSuffix = this.getRandomInt(1, 9);
        const tailDasi = this.getRandomInt(1, 2);
        return `${floor}0${roomSuffix}-${tailDasi}`;
    }

    // 최소값과 최대값 사이의 랜덤 정수 생성
    private getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}