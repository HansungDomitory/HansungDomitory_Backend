import { Student } from "src/apis/students/entities/students.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Notice {

    @PrimaryGeneratedColumn('increment') // 'UUID' 대신에 'increment'로 만들기(1, 2, 3, 4.... 로 id가 자동 만들어짐)
    id: number;

    @ManyToOne(() => Student, { onDelete: 'CASCADE' })
    @JoinColumn()
    student: Student;

    @Column()
    title: string;

    @Column()
    detail: string;

    @CreateDateColumn({ type: 'timestamp' })
    create_at: Date;
}