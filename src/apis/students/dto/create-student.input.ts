import { Column } from "typeorm";

export class CreateStudentInput {
    @Column()
    id?: string;

    @Column()
    name: string;

    @Column()
    password: string;
}