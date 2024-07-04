import { Module } from "@nestjs/common";
import { CommonModule } from "../common.module";
import { StudentController } from "./students.controller";
import AccessStrategy from "./strategies/jwt-access.strategy";
import { RefreshStrategy } from "./strategies/jwt-refresh.strategy";

@Module({
    imports: [CommonModule],
    providers: [AccessStrategy, RefreshStrategy],
    controllers: [StudentController]
})
export class StudentModule {}