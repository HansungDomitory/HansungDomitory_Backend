import { ApiProperty } from "@nestjs/swagger";
import { Student } from "src/apis/students/entities/students.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ApplyOut {

    @ApiProperty({ description: "고유번호" })
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty({ description: "외박 신청 학생" })
    @ManyToOne(() => Student, { onDelete: 'CASCADE' })
    @JoinColumn()
    student: Student;

    @ApiProperty({ description: "외박일수" })
    @Column()
    duration: number;

    @ApiProperty({ description: "시작 날짜" })
    @Column({ type: 'date' })
    start_date: Date;

    @ApiProperty({ description: "종료 날짜" })
    @Column({ type: 'date' })
    end_date: Date;

    @ApiProperty({ description: "내용" })
    @Column()
    detail: string;

    @ApiProperty({ description: "생성일자" })
    @CreateDateColumn()
    create_at: Date;
}