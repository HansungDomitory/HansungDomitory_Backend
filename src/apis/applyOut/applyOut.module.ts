import { Module } from "@nestjs/common";
import { CommonModule } from "../common.module";
import { ApplyOutController } from "./applyOut.controller";

@Module({
    imports: [CommonModule],
    controllers: [ApplyOutController]
})
export class ApplyOutModule {}