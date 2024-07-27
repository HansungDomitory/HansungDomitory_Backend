import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ScoreRecordService } from "./scoreRecords.service";
import { ScoreRecord } from "./entities/scoreRecords.entity";
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AccessGuard } from "../students/guards/rest-auth.guard";
import { RequestWithStudent } from "../students/interfaces/student-service.interface";
import { CreateScoreRecordInput } from "./dto/create-scoreRecord.input";
import { UpdateScoreRecordInput } from "./dto/update-scoreRecord.input";

@ApiTags('상벌점 관리')
@Controller('score')
export class ScoreRecordController {
    constructor(private readonly scoreRecordService: ScoreRecordService) {}

    @ApiOperation({ summary: '상/벌점 부여', description: '특정 학생에게 상점 혹은 벌점을 부여합니다.' })
    @ApiCreatedResponse({ description: '생성 성공', type: ScoreRecord })
    @ApiBearerAuth()
    @UseGuards(AccessGuard)
    @Post()
    async createScoreRecord(@Req() req: RequestWithStudent, @Body() createScoreRecordInput: CreateScoreRecordInput) {
        return await this.scoreRecordService.create(req.user.id, createScoreRecordInput);
    }

    @ApiOperation({ summary: '내 상/벌점 기록 조회', description: '나의 모든 상점 혹은 벌점 부여 기록을 조회합니다.' })
    @ApiOkResponse({ description: '조회 성공', type: [ScoreRecord] })
    @ApiBearerAuth()
    @UseGuards(AccessGuard)
    @Get('student')
    async fetchScoreRecordsByStudentId(@Req() req: RequestWithStudent) {
        return await this.scoreRecordService.findByStudentId(req.user.id);
    }

    @ApiOperation({ summary: '특정 상/벌점 기록 조회', description: '특정 상점 혹은 벌점 부여 기록을 조회합니다.' })
    @ApiOkResponse({ description: '조회 성공', type: ScoreRecord })
    @ApiBearerAuth()
    @UseGuards(AccessGuard)
    @Get(':id')
    async fetchScoreRecordById(@Req() req: RequestWithStudent, @Param('id') id: number) {
        return await this.scoreRecordService.findById(req.user.id, id);
    }

    @ApiOperation({ summary: '상/벌점 기록 수정', description: '특정 상점 혹은 벌점 기록을 수정합니다.' })
    @ApiCreatedResponse({ description: '수정 성공', type: ScoreRecord })
    @ApiBearerAuth()
    @UseGuards(AccessGuard)
    @Patch(':id')
    async updateScoreRecord(@Req() req: RequestWithStudent, @Param('id') id: number, @Body() updateScoreRecordInput: UpdateScoreRecordInput) {
        return await this.scoreRecordService.update(req.user.id, id, updateScoreRecordInput);
    }

    @ApiOperation({ summary: '상/벌점 삭제', description: '특정 상점 혹은 벌점 기록을 삭제합니다.' })
    @ApiCreatedResponse({ description: '삭제 성공', type: Boolean, example: true })
    @ApiBearerAuth()
    @UseGuards(AccessGuard)
    @Delete(':id')
    async deleteScoreRecord(@Req() req: RequestWithStudent, @Param('id') id: number) {
        return await this.scoreRecordService.delete(req.user.id, id);
    }
}