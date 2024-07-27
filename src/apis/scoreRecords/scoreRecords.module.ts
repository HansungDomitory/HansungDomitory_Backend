import { Module } from "@nestjs/common";
import { CommonModule } from "../common.module";
import { ScoreRecordController } from "./scoreRecords.controller";

@Module({
    imports: [CommonModule],
    controllers: [ScoreRecordController]
})
export class ScoreRecordModule {}