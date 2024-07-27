import { ApiProperty } from "@nestjs/swagger";
import { Column } from "typeorm";

export class UpdateScoreRecordInput {
    @ApiProperty({ description: '상벌점여부', example: false })
    @Column()
    is_merit: boolean;

    @ApiProperty({ description: '점수', example: 10 })
    @Column()
    score: number;

    @ApiProperty({ description: '상세내용' })
    @Column()
    detail: string;
}