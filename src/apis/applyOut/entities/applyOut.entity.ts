import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ApplyOut {

    @ApiProperty({ description: "고유번호" })
    @PrimaryGeneratedColumn('increment')
    id: string;

    @ApiProperty({ description: "외박 신청 학생 학번" })
    @Column()
    student_id: string;

    @ApiProperty({ description: "외박일수" })
    @Column()
    duration: number;

    @ApiProperty({ description: "시작 날짜" })
    @Column()
    start_date: Date;

    @ApiProperty({ description: "종료 날짜" })
    @Column()
    end_date: Date;

    @ApiProperty({ description: "내용" })
    @Column()
    detail: string;

    @ApiProperty({ description: "생성일자" })
    @CreateDateColumn()
    create_at: Date;
}