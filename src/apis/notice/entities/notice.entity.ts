import { ApiProperty } from "@nestjs/swagger";
import { Student } from "src/apis/students/entities/students.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Notice {

    @ApiProperty({ description: '고유 번호' })
    @PrimaryGeneratedColumn('increment') // 'UUID' 대신에 'increment'로 만들기(1, 2, 3, 4.... 로 id가 자동 만들어짐)
    id: number;

    @ApiProperty({ description: '작성자' })
    @ManyToOne(() => Student, { onDelete: 'CASCADE' })
    @JoinColumn()
    student: Student;

    @ApiProperty({ description: '제목' })
    @Column({ type: 'text' })
    title: string;

    @ApiProperty({ description: '내용' })
    @Column({ type: 'text' })
    detail: string;

    @ApiProperty({ description: '생성일자' })
    @CreateDateColumn({ type: 'timestamp' })
    create_at: Date;
}