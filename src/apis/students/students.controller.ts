import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Req, Res, UnprocessableEntityException, UseGuards } from "@nestjs/common";
import { StudentService } from "./students.service";
import { CreateStudentInput } from "./dto/create-student.input";
import { UpdateStudentInput } from "./dto/update-student.input";
import * as bcrypt from 'bcrypt';
import { Response } from "express";
import { RequestWithStudent } from "./interfaces/student-service.interface";
import { AccessGuard } from "./guards/rest-auth.guard";

@Controller('students')
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @Post()
    async signUp(@Body() createStudentInput: CreateStudentInput) {
        return this.studentService.create({createStudentInput});
    }

    @Get()
    async fetchAllStudents() {
        return this.studentService.findAll();
    }
    @Get(':id')
    async fetchStudentById(@Param('id') id: string) {
        return this.studentService.findById(id);
    }

    @UseGuards(AccessGuard)
    @Get('me')
    async whoAmI(@Req() req: RequestWithStudent) {
        return this.studentService.findById(req.student.id);
    }

    @UseGuards(AccessGuard)
    @Patch(':id')
    async updateStudent(
        @Param('id') id: string,
        @Body() updateStudentInput: UpdateStudentInput
    ) {
        const result = await this.studentService.update(id, { 
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
    @Delete(':id')
    async deleteStudent(@Param('id') id: string, @Req() req: RequestWithStudent) {
        if(req.student.id !== id) {
            throw new ForbiddenException('현재 로그인 된 계정으로만 삭제할 수 있습니다.');
        }
        return this.studentService.delete(id);
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
    @Post('restore-access-token')
    async restoreAccessToken(@Req() req: RequestWithStudent) {
        return this.studentService.getRestoreToken({ id: req.student.id });
    }
}