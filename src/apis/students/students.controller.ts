import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Req, Res, UnprocessableEntityException, UseGuards } from "@nestjs/common";
import { StudentService } from "./students.service";
import { CreateStudentInput } from "./dto/create-student.input";
import { UpdateStudentInput } from "./dto/update-student.input";
import * as bcrypt from 'bcrypt';
import { Response } from "express";
import { RequestWithStudent } from "./interfaces/student-service.interface";
import { AccessGuard } from "./guards/rest-auth.guard";

@Controller('student')
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @Post() //post: 데이터 추가
    async signUp(@Body() createStudentInput: CreateStudentInput) {
        return this.studentService.create({createStudentInput});
    }

    @Get() //get: 데이터 조회
    async fetchAllStudents() {
        return this.studentService.findAll();
    }

    @UseGuards(AccessGuard)
    @Get('me')
    async whoAmI(@Req() req: RequestWithStudent) {
        return this.studentService.findById(req.user.id);
    }

    @Get(':id')
    async fetchStudentById(@Param('id') id: string) {
        return this.studentService.findById(id);
    }

    @UseGuards(AccessGuard)
    @Patch() //patch: 데이터 수정
    async updateStudent(
        @Req() req: RequestWithStudent,
        @Body() updateStudentInput: UpdateStudentInput
    ) {
        const result = await this.studentService.update(req.user.id, { 
            updateStudentInput,
        });
        if(!result) {
            throw new BadRequestException(
                '알 수 없는 이유로 학생 정보 수정에 실패하였습니다.',
            );
        }
        return result;
    }

    @UseGuards(AccessGuard)
    @Delete() //delete: 삭제
    async deleteStudent(@Req() req: RequestWithStudent) {
        return this.studentService.delete(req.user.id);
    }

    @Post('login')
    async login(
        @Body('id') id: string,
        @Body('password') password: string,
        @Res() res: Response,
    ) {
        const student = await this.studentService.findById(id);
        if (!student) {
            throw new UnprocessableEntityException('해당 학번을 가진 학생이 존재하지 않습니다.');
        }

        const isAuth = await bcrypt.compare(password, student.password);
        if (!isAuth) {
            throw new UnprocessableEntityException('비밀번호가 틀렸습니다.');
        }

        const accessToken = this.studentService.getAccessToken(student);
        this.studentService.getRefreshToken(student, { req: null, res });

        return res.json({ accessToken });
    }

    @Post('logout')
    async logout(@Res() res: Response) {
        res.setHeader('Set-Cookie', [
            'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure;',
        ]);
        res.json({ success: true });
    }

    @UseGuards(AccessGuard)
    @Post('refreshToken')
    async restoreAccessToken(@Req() req: RequestWithStudent) {
        return this.studentService.getRestoreToken({ id: req.user.id });
    }
}