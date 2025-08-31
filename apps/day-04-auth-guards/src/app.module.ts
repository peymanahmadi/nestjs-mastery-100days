import { AuthModule } from "@day-02-auth/auth/auth.module";
import { Module } from "@nestjs/common";
import { ProtectedUsersModule } from "./users/protected-users.module";

@Module({
    imports: [ProtectedUsersModule, AuthModule]
})
export class AppModule {}