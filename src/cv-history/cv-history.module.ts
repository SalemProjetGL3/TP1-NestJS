// src/cv-history/cv-history.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvHistory } from './entities/cv-history.entity';
import { CvHistoryService } from './cv-history.service';
import { CvHistoryController } from './cv-history.controller';
import { AuthModule } from '../auth/auth.module'; // For guards
import { UserModule } from '../user/user.module'; // For User decorator context potentially
import { CvModule } from '../cv/cv.module'; // Import CvModule for CvService

@Module({
  imports: [
    TypeOrmModule.forFeature([CvHistory]),
    AuthModule, // For JwtAuthGuard, AdminGuard
    UserModule, // For @User decorator (if it relies on UserModule providers)
    forwardRef(() => CvModule), // Use forwardRef if CvModule might import CvHistoryModule
  ],
  providers: [CvHistoryService],
  exports: [CvHistoryService], // Export service if other modules need it directly
})
export class CvHistoryModule {}