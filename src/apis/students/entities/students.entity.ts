import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Student {

    @ApiProperty({ description: "학번", minLength: 7, maxLength: 7 })
    @PrimaryColumn('varchar', { length: 7 })
    id: string;

    @ApiProperty({ description: "이름" })
    @Column()
    name: string;

    @ApiProperty({ description: "비밀번호" })
    @Column()
    password: string;

    @ApiProperty({ description: "상점" })
    @Column({default: 0})
    merit_score: number;

    @ApiProperty({ description: "벌점" })
    @Column({default: 0})
    demerit_score: number;

    @ApiProperty({ description: "호실" })
    @Column({ nullable: true, length: 5 })
    room: string;

    @ApiProperty({ description: "가입일자" })
    @CreateDateColumn()
    create_at: Date;

}