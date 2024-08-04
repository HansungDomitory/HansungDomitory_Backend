import { Module } from "@nestjs/common";
import { CommonModule } from "../common.module";
import { NoticeController } from "./notice.controller";

@Module({
    imports: [CommonModule],
    controllers: [NoticeController]
})
export class NoticeModule {}