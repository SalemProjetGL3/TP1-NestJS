// src/cv-history/cv-history.controller.ts
import { Controller, Get, Param, UseGuards, UnauthorizedException, Query } from '@nestjs/common';
import { CvHistoryService } from './cv-history.service';
import { CvHistory } from './entities/cv-history.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { AdminGuard } from '../auth/guard/admin.guard';
import { User as UserFromDecorator } from '../decorators/user.decorator';
import { User as UserEntity } from '../user/entities/user.entity';
import { UserRoleEnum } from 'src/enums/user-role.enum';
import { CvService } from '../cv/cv.service'; // To check CV ownership

@Controller('cv-history')
@UseGuards(JwtAuthGuard)
export class CvHistoryController {
  constructor(
    private readonly cvHistoryService: CvHistoryService,
    private readonly cvService: CvService, // Inject CvService
    ) {}

  @Get()
  @UseGuards(AdminGuard) // Only admins can see all history by default
  findAll(): Promise<CvHistory[]> {
    return this.cvHistoryService.findAll({ relations: ['performedBy', 'cv'] });
  }

  @Get('cv/:cvId')
  async findHistoryForCv(
    @Param('cvId') cvId: string,
    @UserFromDecorator() currentUser: UserEntity,
  ): Promise<CvHistory[]> {
    const cvNumericId = +cvId;
    // Check if user is admin or owns the CV
    if (currentUser.role !== UserRoleEnum.ADMIN) {
      try {
        // Check if the user can access this CV (owns it)
        // This relies on CvService.findOne to throw an error if not authorized
        await this.cvService.findOne(cvNumericId, currentUser);
      } catch (error) {
        // If cvService.findOne throws (e.g., NotFound or Unauthorized)
        throw new UnauthorizedException('Chkounek sadiki?');
      }
    }
    return this.cvHistoryService.findByCvId(cvNumericId, { relations: ['performedBy'] });
  }

  @Get('user/me') // Get history of operations performed BY the logged-in user
  findHistoryByCurrentUser(@UserFromDecorator() user: UserEntity): Promise<CvHistory[]> {
    return this.cvHistoryService.findByUserId(user.id, { relations: ['cv'] });
  }

  @Get('user/:userId') // Admin can view history by any user ID
  @UseGuards(AdminGuard)
  findHistoryByUserId(@Param('userId') userId: string): Promise<CvHistory[]> {
    return this.cvHistoryService.findByUserId(+userId, { relations: ['cv'] });
  }
}