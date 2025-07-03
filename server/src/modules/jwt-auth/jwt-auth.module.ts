import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { TokensModule } from '../tokens/tokens.module';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Module({
  imports: [UsersModule, TokensModule],
  providers: [JwtStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class JwtAuthModule {}
