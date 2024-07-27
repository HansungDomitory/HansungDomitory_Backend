import { ApiProperty } from "@nestjs/swagger";
import { Column } from "typeorm";

export class CreateScoreRecordInput {
    @ApiProperty({ description: '학번', example: '2071361' })
    @Column()
    student_id: string;

    @ApiProperty({ description: '상벌점여부', example: true })
    @Column()
    is_merit: boolean;

    @ApiProperty({ description: '점수', example: 10 })
    @Column()
    score: number;

    @ApiProperty({ description: '상세내용' })
    @Column()
    detail: string;
}