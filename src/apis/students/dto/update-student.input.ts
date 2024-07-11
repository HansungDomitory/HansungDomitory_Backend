import { ApiProperty } from "@nestjs/swagger";
import { Column } from "typeorm";

export class UpdateStudentInput {
    @ApiProperty({ description: "학번" })
    @Column({ nullable: true})
    id?: string;

    @ApiProperty({ description: "이름" })
    @Column({ nullable: true})
    name?: string;

    @ApiProperty({ description: "비밀번호" })
    @Column({ nullable: true })
    password?: string;
}