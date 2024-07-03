import { Column } from "typeorm";

export class UpdateStudentInput {
    @Column({ nullable: true})
    id?: string;

    @Column({ nullable: true})
    name?: string;

    @Column({ nullable: true })
    password?: string;
}