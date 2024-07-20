import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { ApplyOutService } from "./applyOut.service";
import { AccessGuard } from "../students/guards/rest-auth.guard";
import { RequestWithStudent } from "../students/interfaces/student-service.interface";
import { CreateApplyOutInput } from "./dto/create-applyOut.input";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UpdateApplyOutInput } from "./dto/update-applyOut.input";
import { ApplyOut } from "./entities/applyOut.entity";

@ApiTags('외박 신청')
@Controller('apply')
export class ApplyOutController {
    constructor(private readonly applyOutService: ApplyOutService) {}

    @ApiOperation({ summary: '외박신청 생성', description: '외박신청을 추가합니다.' })
    @ApiCreatedResponse({ description: '생성 성공', type: ApplyOut })
    @ApiBearerAuth()
    @UseGuards(AccessGuard)
    @Post()
    async createApplyOut(@Req() req: RequestWithStudent, @Body() createApplyOutInput: CreateApplyOutInput) {
        return await this.applyOutService.create(req.user.id, createApplyOutInput);
    }

    @ApiOperation({ summary: '내 외박신청 조회', description: '로그인한 사용자가 생성한 모든 외박신청을 조회합니다.' })
    @ApiOkResponse({ description: '조회 성공', type: [ApplyOut] })
    @ApiBearerAuth()
    @UseGuards(AccessGuard)
    @Get()
    async fetchMyAllApplyOut(@Req() req: RequestWithStudent) {
        return await this.applyOutService.findByStudentId(req.user.id);
    }

    @ApiOperation({ summary: '외박신청 고유번호로 조회', description: '외박신청의 고유번호를 통해 특정 외박신청을 조회합니다.' })
    @ApiOkResponse({ description: '조회 성공', type: ApplyOut })
    @ApiBearerAuth()
    @UseGuards(AccessGuard)
    @Get(':id')
    async fetchApplyOutById(@Req() req: RequestWithStudent, @Param('id') id: number) {
        return await this.applyOutService.findById(req.user.id, id);
    }

    @ApiOperation({ summary: '외박신청 수정', description: '나의 특정 외박신청 내용을 수정합니다.' })
    @ApiCreatedResponse({ description: '수정 성공', type: ApplyOut })
    @ApiBearerAuth()
    @UseGuards(AccessGuard)
    @Patch(':id')
    async updateApplyOut(@Req() req: RequestWithStudent, @Param('id') id: number, @Body() updateApplyOutInput: UpdateApplyOutInput) {
        return await this.applyOutService.update(req.user.id, id, updateApplyOutInput)
    }

    @ApiOperation({ summary: '외박신청 삭제', description: '나의 특정 외박신청을 삭제합니다.' })
    @ApiCreatedResponse({ description: '삭제 성공', example: true })
    @ApiBearerAuth()
    @UseGuards(AccessGuard)
    @Delete(':id')
    async deleteApplyOut(@Req() req: RequestWithStudent, @Param('id') id: number) {
        return await this.applyOutService.delete(req.user.id, id);
    }
}