import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Student {

    @PrimaryColumn('varchar', { length: 7 })
    id: string;

    @Column()
    name: string;

    @Column()
    password: string;

    @Column({default: 0})
    merit_score: number;

    @Column({default: 0})
    demerit_score: number;

    @CreateDateColumn()
    create_at: Date;

}