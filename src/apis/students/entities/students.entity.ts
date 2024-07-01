import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Student {

    @PrimaryColumn('varchar', { length: 7 })
    id: string;

    @Column()
    name: string;

    @Column()
    password: string;

    @Column()
    merit_score: number;

    @Column()
    demerit_score: number;

    @CreateDateColumn()
    create_at: Date;

}