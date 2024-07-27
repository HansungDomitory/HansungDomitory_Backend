import { ApiProperty } from "@nestjs/swagger";
import { Student } from "src/apis/students/entities/students.entity";
import { Column, CreateDateColumn, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export class ScoreRecord {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Student, { onDelete: 'CASCADE' })
    @JoinColumn()
    student: Student;

    @Column()
    is_merit: boolean;

    @Column()
    score: number;

    @Column()
    detail: string;

    @ApiProperty({ description: "생성일자" })
    @CreateDateColumn()
    create_at: Date;
}