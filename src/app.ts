import "reflect-metadata";
import {
  Controller,
  Get,
  Inject,
  Injectable,
  Module,
  Param,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import fixtures from "../specs/fixtures.json";
import { ApiError, configureHttp } from "./http";
import { TelemetryShutdown } from "./telemetry";

@Injectable()
export class UsersService {
  find(id: string) {
    const user = fixtures.find((item) => item.id === id);
    if (!user)
      throw new ApiError(404, "USER_NOT_FOUND", "Cliente não encontrado.");
    return { id: user.id, name: user.name, address: user.address };
  }
}

@Controller()
class UsersController {
  constructor(@Inject(UsersService) private readonly users: UsersService) {}
  @Get("health")
  health() {
    return { status: "ok" };
  }
  @Get("users/:id")
  find(@Param("id") id: string) {
    return this.users.find(id);
  }
}

@Module({ controllers: [UsersController], providers: [UsersService, TelemetryShutdown] })
class AppModule {}

export async function createApp() {
  const app = await NestFactory.create(AppModule, { logger: false });
  configureHttp(app);
  return app;
}
