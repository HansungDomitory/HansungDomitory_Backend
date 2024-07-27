import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Req, Res, UnprocessableEntityException, UseGuards } from "@nestjs/common";
import { StudentService } from "./students.service";
import { CreateStudentInput } from "./dto/create-student.input";
import { UpdateStudentInput } from "./dto/update-student.input";
import * as bcrypt from 'bcrypt';
import { Response } from "express";
import { RequestWithStudent } from "./interfaces/student-service.interface";
import { AccessGuard, RefreshGuard } from "./guards/rest-auth.guard";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiProperty, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Student } from "./entities/students.entity";
import { LoginStudentInput } from "./dto/login-student.input";

@Controller()
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @ApiTags('학생')
    @ApiOperation({ summary: '회원가입', description: '학번(7자리), 이름, 비밀번호 필수 입력하여 회원가입합니다.' })
    @ApiCreatedResponse({ description: '사용자 생성에 성공', type: Student })
    @Post('student') //post: 데이터 추가
    async signUp(@Body() createStudentInput: CreateStudentInput) {
        return await this.studentService.create({createStudentInput});
    }

    @ApiTags('학생')
    @ApiOperation({ summary: '전체 학생 조회', description: '모든 학생의 정보를 조회합니다.' })
    @ApiOkResponse({ description: '조회 성공', type: [Student] })
    @Get('student') //get: 데이터 조회
    async fetchAllStudents() {
        return await this.studentService.findAll();
    }

    @ApiTags('학생')
    @ApiOperation({ summary: '본인 정보 조회', description: '현재 로그인 된 학생의 정보를 조회합니다.'} )
    @ApiOkResponse({ description: '조회 성공', type: Student })
    @ApiBearerAuth()
    @UseGuards(AccessGuard)
    @Get('student/me')
    async whoAmI(@Req() req: RequestWithStudent) {
        return await this.studentService.findById(req.user.id);
    }

    @ApiTags('학생')
    @ApiOperation({ summary: '학번으로 학생 조회', description: '학번을 통해 해당 학생의 정보를 조회합니다.' })
    @ApiOkResponse({ description: '조회 성공', type: Student })
    @Get('student/:id')
    async fetchStudentById(@Param('id') id: string) {
        return await this.studentService.findById(id);
    }

    @ApiTags('학생')
    @ApiOperation({ summary: '학생 정보 수정', description: '현재 로그인 된 사용자의 정보를 수정합니다.' })
    @ApiOkResponse({ description: '수정 성공', type: Student })
    @ApiResponse({status: '4XX', description: '수정 실패', example: '알 수 없는 이유로 학생 정보 수정에 실패하였습니다.' })
    @ApiBearerAuth()
    @UseGuards(AccessGuard)
    @Patch('student') //patch: 데이터 수정
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

    @ApiTags('학생')
    @ApiOperation({ summary: "회원탈퇴", description: "현재 로그인 된 학생의 계정이 탈퇴됩니다." })
    @ApiOkResponse({ description: "탈퇴 성공", example: true })
    @ApiBearerAuth()
    @UseGuards(AccessGuard)
    @Delete('student') //delete: 삭제
    async deleteStudent(@Req() req: RequestWithStudent) {
        return await this.studentService.delete(req.user.id);
    }

    @ApiTags('로그인')
    @ApiOperation({ summary: "로그인", description: "학번과 비밀번호를 입력받아 JWT 토큰을 받습니다." })
    @ApiCreatedResponse({ description: '로그인 성공', example: 'JWT 토큰값'})
    @Post('login')
    async login(
        @Body() loginStudentInput: LoginStudentInput,
        @Res() res: Response,
    ) {
        const student = await this.studentService.findById(loginStudentInput.id);
        if (!student) {
            throw new UnprocessableEntityException('해당 학번을 가진 학생이 존재하지 않습니다.');
        }

        console.log(loginStudentInput)
        const isAuth = await bcrypt.compare(loginStudentInput.password, student.password);
        if (!isAuth) {
            throw new UnprocessableEntityException('비밀번호가 틀렸습니다.');
        }

        const accessToken = this.studentService.getAccessToken(student);
        this.studentService.getRefreshToken(student, { req: null, res });

        return res.json({ accessToken });
    }

    @ApiTags('로그인')
    @ApiOperation({ summary: '로그아웃', description: 'Cookie에 저장된 Restore 토큰을 삭제합니다.' })
    @ApiCreatedResponse({ description: '로그아웃 성공'})
    @Post('logout')
    async logout(@Res() res: Response) {
        res.setHeader('Set-Cookie', [
            'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure;',
        ]);
        res.json({ success: true });
    }

    @ApiTags('로그인')
    @ApiOperation({ summary: '재로그인', description: '로그인하여 생성된 JWT 토큰이 만료되었을 때, Cookie에 저장된 restore token을 이용하여 다시 JWT 토큰을 받아옵니다.' })
    @ApiCreatedResponse({ description: '재로그인 성공', example: 'JWT 토큰값' })
    @UseGuards(RefreshGuard)
    @Post('restoreToken')
    async restoreAccessToken(@Req() req: RequestWithStudent) {
        return this.studentService.getRestoreToken({ id: req.user.id });
    }
}