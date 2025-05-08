// src/cv/cv.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cv } from './entities/cv.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { Page } from '../common/classes/page.class';
import { PageMeta } from '../common/classes/page-meta.class';
import { SearchCvDto } from './dto/search-cv.dto';
import { User as UserEntity } from 'src/user/entities/user.entity'; // <--- IMPORT UserEntity
import { UserRoleEnum } from 'src/enums/user-role.enum'; // <--- IMPORT UserRoleEnum

// Event Emitter and History Service
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CvHistoryService } from '../cv-history/cv-history.service'; // <--- IMPORT CvHistoryService
import { CvOperationType } from '../cv-history/entities/cv-history.entity'; // <--- IMPORT CvOperationType
import { CvEventDto } from '../sse/dto/cv-event.dto'; // This will be the simplified DTO
import { CV_CREATED_EVENT, CV_UPDATED_EVENT, CV_DELETED_EVENT } from '../common/events/cv.events';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
    private readonly eventEmitter: EventEmitter2, // <--- INJECT EventEmitter2
    private readonly cvHistoryService: CvHistoryService, // <--- INJECT CvHistoryService
  ) {}

  async create(createCvDto: CreateCvDto, performingUser: UserEntity): Promise<Cv> { // <--- Added UserEntity type
    const newCv = this.cvRepository.create(createCvDto);
    newCv.user = performingUser; // Link the user who creates it
    const savedCv = await this.cvRepository.save(newCv);

    // Log operation
    await this.cvHistoryService.logOperation(
      savedCv,
      performingUser,
      CvOperationType.CREATE,
      // No complex details needed as per your request
      // { cvId: savedCv.id, performedBy: performingUser.username } // Example simple detail
    );

    // Emit event
    const eventPayload: CvEventDto = {
      operationType: CvOperationType.CREATE,
      cvId: savedCv.id,
      cvName: savedCv.name, // Optional: for quick identification in notifications
      performedById: performingUser.id,
      performedByUsername: performingUser.username,
      cvOwnerId: savedCv.user.id, // The user who owns the CV
      timestamp: new Date(),
    };
    this.eventEmitter.emit(CV_CREATED_EVENT, eventPayload);

    return savedCv;
  }

  async findAll(searchCvDto: SearchCvDto, requestingUser: UserEntity): Promise<Page<Cv>> { // <--- Added UserEntity type
    const query = this.cvRepository.createQueryBuilder('cv')
        .leftJoinAndSelect('cv.user', 'owner'); // Eager load user for cvOwnerId later if needed

    if (requestingUser.role !== UserRoleEnum.ADMIN) { // <--- Use UserRoleEnum
      query.where('cv.userId = :userId', { userId: requestingUser.id });
    }
    // Removed the `else { query.where('cv.userId IS NOT NULL'); }` as it might be too restrictive
    // Admins should typically see all CVs, including those potentially without a userId if data allows.
    // If CVs must have a user, your DB constraints or entity definition should enforce that.

    if (searchCvDto.searchString) {
      query.andWhere('(LOWER(cv.name) LIKE LOWER(:search) OR LOWER(cv.firstname) LIKE LOWER(:search) OR LOWER(cv.job) LIKE LOWER(:search))', {
        search: `%${searchCvDto.searchString}%`,
      });
    }
    if (searchCvDto.age !== undefined) {
      query.andWhere('cv.age = :age', { age: searchCvDto.age });
    }

    query.orderBy('cv.id', 'DESC'); // Example ordering
    const itemCount = await query.getCount();
    // Your original .getRawAndEntities() might be for specific reasons.
    // .getMany() is simpler if you just need entities.
    const entities = await query
      .skip(searchCvDto.skip || 0) // Ensure skip and take have defaults
      .take(searchCvDto.take || 10)
      .getMany();

    const pageMeta = new PageMeta(searchCvDto, itemCount);
    return new Page(entities, pageMeta);
  }

  async findOne(id: number, requestingUser: UserEntity): Promise<Cv> { // <--- Added UserEntity type
    const cv = await this.cvRepository.findOne({
      where: { id },
      relations: ['user'], // Ensure user is loaded for ownership checks and ownerId
    });

    if (!cv) {
      throw new NotFoundException(`CV #${id} not found`);
    }

    // Authorization check
    if (requestingUser.role !== UserRoleEnum.ADMIN && cv.user?.id !== requestingUser.id) { // <--- Use UserRoleEnum
      throw new NotFoundException( // Or UnauthorizedException, depending on desired behavior
        `CV #${id} not found or you don't have permission to access it.`,
      );
    }
    return cv;
  }

  async update(id: number, updateCvDto: UpdateCvDto, performingUser: UserEntity): Promise<Cv> { // <--- Added UserEntity type
    const cv = await this.findOne(id, performingUser); // findOne includes auth check

    // If only admins can update, ensure this (though controller guard should handle it)
    // if (performingUser.role !== UserRoleEnum.ADMIN) {
    //   throw new UnauthorizedException('You do not have permission to update this CV.');
    // }

    Object.assign(cv, updateCvDto);
    const updatedCv = await this.cvRepository.save(cv);

    // Log operation
    await this.cvHistoryService.logOperation(
      updatedCv,
      performingUser,
      CvOperationType.UPDATE,
      // { cvId: updatedCv.id, performedBy: performingUser.username } // Example simple detail
    );

    // Emit event
    const eventPayload: CvEventDto = {
      operationType: CvOperationType.UPDATE,
      cvId: updatedCv.id,
      cvName: updatedCv.name,
      performedById: performingUser.id,
      performedByUsername: performingUser.username,
      cvOwnerId: updatedCv.user.id, // User who owns the CV
      timestamp: new Date(),
    };
    this.eventEmitter.emit(CV_UPDATED_EVENT, eventPayload);

    return updatedCv;
  }

  async remove(id: number, performingUser: UserEntity): Promise<void> { // <--- Added UserEntity type
    const cv = await this.findOne(id, performingUser); // findOne includes auth check

    // If only admins can delete, ensure this (controller guard should handle it)
    // if (performingUser.role !== UserRoleEnum.ADMIN) {
    //   throw new UnauthorizedException('You do not have permission to delete this CV.');
    // }

    const cvOwnerId = cv.user?.id; // Capture before deletion if user relation might be lost
    const cvName = cv.name;

    await this.cvRepository.remove(cv);

    // Log operation
    await this.cvHistoryService.logOperation(
      { id }, // Pass an object with the ID, as the entity is deleted
      performingUser,
      CvOperationType.DELETE,
      // { cvId: id, performedBy: performingUser.username } // Example simple detail
    );

    // Emit event
    const eventPayload: CvEventDto = {
      operationType: CvOperationType.DELETE,
      cvId: id,
      cvName: cvName,
      performedById: performingUser.id,
      performedByUsername: performingUser.username,
      cvOwnerId: cvOwnerId, // User who owned the CV
      timestamp: new Date(),
    };
    this.eventEmitter.emit(CV_DELETED_EVENT, eventPayload);
  }
}