import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { NoticeService } from "./notice.service";
import { Notice } from "./entities/notice.entity";
import { AccessGuard } from "../students/guards/rest-auth.guard";
import { RequestWithStudent } from "../students/interfaces/student-service.interface";
import { CreateNoticeInput } from "./dto/create-notice.input";
import { UpdateNoticeInput } from "./dto/update-notice.input";

@ApiTags('공지사항 관리')
@Controller('notice')
export class NoticeController {
    constructor(private readonly noticeService: NoticeService) {}

    @ApiOperation({ summary: '공지사항 생성', description: '공지사항을 생성합니다.' })
    @ApiCreatedResponse({ description: '생성 성공', type: Notice })
    @ApiBearerAuth()
    @UseGuards(AccessGuard)
    @Post()
    async createNotice(@Req() req: RequestWithStudent, @Body() createNoticeInput: CreateNoticeInput) {
        return await this.noticeService.create(req.user.id, createNoticeInput);
    }

    @ApiOperation({ summary: '공지사항 검색', description: '특정된 키워드를 포함하는 공지사항을 검색합니다.' })
    @ApiOkResponse({ description: '검색 성공', type: [Notice] })
    @Get('search')
    async searchNotices(@Query('Keyword') Keyword: string) {
        return await this.noticeService.search(Keyword);
    }

    @ApiOperation({ summary: '공지사항 조회', description: '모든 공지사항을 조회합니다.' })
    @ApiOkResponse({ description: '조회 성공', type: [Notice] })
    @Get()
    async fetchAllNotices() {
        return await this.noticeService.findAll();
    }

    @ApiOperation({ summary: '특정된 공지사항 조회', description: '특정된 공지사항을 조회합니다.' })
    @ApiOkResponse({ description: '조회 성공', type: Notice })
    @Get(':id')
    async fetchNoticeById(@Param('id') id: number) {
        return await this.noticeService.findOne(id);
    }

    @ApiOperation({ summary: '공지사항 수정', description: '특정된 공지사항을 수정합니다.' })
    @ApiCreatedResponse({ description: '수정 성공', type: Notice })
    @ApiBearerAuth()
    @UseGuards(AccessGuard)
    @Patch(':id')
    async updateNotice(@Req() req: RequestWithStudent, @Param('id') id: number, @Body() updateNoticeInput: UpdateNoticeInput) {
        return await this.noticeService.update(req.user.id, id, updateNoticeInput);
    }

    @ApiOperation({ summary: '공지사항 삭제', description: '특정된 공지사항을 삭제합니다.' })
    @ApiCreatedResponse({ description: '삭제 성공', type: Boolean, example: true })
    @ApiBearerAuth()
    @UseGuards(AccessGuard)
    @Delete(':id')
    async deleteNotice(@Req() req: RequestWithStudent, @Param('id') id: number) {
        return await this.noticeService.delete(req.user.id, id);
    }
}