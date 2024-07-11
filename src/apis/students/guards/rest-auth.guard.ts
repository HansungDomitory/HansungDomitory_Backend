import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export class AccessGuard extends AuthGuard('heoga') {
  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}

export class RefreshGuard extends AuthGuard('jaeheoga') {
  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}