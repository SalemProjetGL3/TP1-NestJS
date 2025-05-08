// src/sse/sse.controller.ts
import { Controller, Sse, UseGuards, MessageEvent, Logger } from '@nestjs/common';
import { Observable, Subject, filter, map } from 'rxjs';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { User as UserFromDecorator } from '../decorators/user.decorator';
import { User as UserEntity } from '../user/entities/user.entity';
import { CvEventDto } from './dto/cv-event.dto'; // Uses the simplified DTO
import { UserRoleEnum } from 'src/enums/user-role.enum';

export const cvUpdateSubject = new Subject<CvEventDto>();

@Controller('sse')
export class SseController {
  private readonly logger = new Logger(SseController.name);

  @Sse('cv-updates')
  @UseGuards(JwtAuthGuard)
  cvUpdatesStream(
    @UserFromDecorator() user: UserEntity,
  ): Observable<MessageEvent> {
    this.logger.log(`User ${user.username} (ID: ${user.id}, Role: ${user.role}) connected to CV updates stream.`);
    return cvUpdateSubject.asObservable().pipe(
      filter((event: CvEventDto) => { // Event is now the simplified CvEventDto
        const isAdmin = user.role === UserRoleEnum.ADMIN;
        const isOwner = event.cvOwnerId === user.id;

        if (isAdmin) {
          this.logger.verbose(`Admin ${user.username} receiving event for CV ${event.cvId} (Owner: ${event.cvOwnerId}, Performed by: ${event.performedById})`);
          return true;
        }
        if (isOwner) {
          this.logger.verbose(`User ${user.username} receiving event for their CV ${event.cvId} (Performed by: ${event.performedById})`);
          return true;
        }
        this.logger.verbose(`User ${user.username} filtered out event for CV ${event.cvId} (Owner: ${event.cvOwnerId}, Performed by: ${event.performedById})`);
        return false;
      }),
      map((eventData: CvEventDto) => { // eventData is now the simplified CvEventDto
        return { data: eventData } as MessageEvent;
      }),
    );
  }
}