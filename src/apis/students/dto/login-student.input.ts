import { ApiProperty } from "@nestjs/swagger";
import { Column } from "typeorm";

export class LoginStudentInput {
    @ApiProperty({ description: "학번" })
    @Column()
    id: string;

    @ApiProperty({ description: "비밀번호" })
    @Column()
    password: string;
}