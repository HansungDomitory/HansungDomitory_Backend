import { ApiProperty } from "@nestjs/swagger";
import { Column } from "typeorm";

export class CreateApplyOutInput {
    @ApiProperty({ description: '시작 날짜 (YYYY-MM-DD)', example: '2020-01-01' })
    @Column()
    start_date: string;

    @ApiProperty({ description: '종료 날짜 (YYYY-MM-DD)', example: '2020-01-01' })
    @Column()
    end_date: string;

    @ApiProperty({ description: '내용' })
    @Column()
    detail: string;
}