import { ApiProperty } from "@nestjs/swagger";
import { Column } from "typeorm";

export class CreateNoticeInput {
    @ApiProperty({ description: '제목' })
    @Column()
    title: string;

    @ApiProperty({ description: '상세내용' })
    @Column()
    detail: string;
}