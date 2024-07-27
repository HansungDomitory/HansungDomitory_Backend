import { ApiProperty } from "@nestjs/swagger";
import { Student } from "src/apis/students/entities/students.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ScoreRecord {
    @ApiProperty({ description: "고유번호" })
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty({ description: "해당 기록 관련 학생" })
    @ManyToOne(() => Student, { onDelete: 'CASCADE' })
    @JoinColumn()
    student: Student;

    @ApiProperty({ description: "상점/벌점 여부" })
    @Column()
    is_merit: boolean;

    @ApiProperty({ description: "점수" })
    @Column()
    score: number;

    @ApiProperty({ description: "상세내용" })
    @Column()
    detail: string;

    @ApiProperty({ description: "생성일자" })
    @CreateDateColumn()
    create_at: Date;
}