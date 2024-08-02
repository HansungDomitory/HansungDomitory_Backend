import { InjectRepository } from "@nestjs/typeorm";
import { Notice } from "./entities/notice.entity";
import { ILike, Repository } from "typeorm";
import { CreateNoticeInput } from "./dto/create-notice.input";
import { ForbiddenException } from "@nestjs/common";
import { UpdateNoticeInput } from "./dto/update-notice.input";

export class NoticeService {
    constructor(
        @InjectRepository(Notice)
        private readonly noticeRepository: Repository<Notice>
    ) {}

    async create(myId: string, createNoticeInput: CreateNoticeInput): Promise<Notice> {
        if(myId !== '0000000') {
            throw new ForbiddenException('관리자만 공지사항을 생성할 수 있습니다.');
        }
        const notice = this.noticeRepository.create({ ...createNoticeInput});
        return await this.noticeRepository.save(notice);
    }

    async findAll(): Promise<Notice[]> {
        return await this.noticeRepository.find({
            order: { create_at: 'DESC' }
        });
    }

    async findOne(id: number): Promise<Notice> {
        return await this.noticeRepository.findOne({
            where: { id },
            relations: ['student']
        });
    }

    async update(myId: string, id: number, updateNoticeInput: UpdateNoticeInput): Promise<Notice> {
        if(myId !== '0000000') {
            throw new ForbiddenException('관리자만 공지사항을 수정할 수 있습니다.');
        }
        await this.noticeRepository.update({ id }, { ...updateNoticeInput });
        return this.findOne(id);
    }

    async delete(myId: string, id: number): Promise<boolean> {
        if(!myId && myId !== '0000000') {
            throw new ForbiddenException('관리자만 공지사항을 삭제할 수 있습니다.');
        }
        const result = await this.noticeRepository.delete({ id });
        return result.affected > 0;
    }

    async search(Keyword: string): Promise<Notice[]> {
        return await this.noticeRepository.find({
            where: [
                { title: ILike(`%${Keyword}%`) },
                { detail: ILike(`%${Keyword}%`) }
            ],
            order: { create_at: 'DESC' }
        });
    }
}