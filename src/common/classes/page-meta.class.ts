import { PageMetaInterface } from '../interfaces/page-meta.interface';
import { PageOptionsDto } from '../dto/page-options.dto';

export class PageMeta implements PageMetaInterface {
  readonly page: number;
  readonly take: number;
  readonly itemCount: number;
  readonly pageCount: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;

  constructor(pageOptionsDto: PageOptionsDto, itemCount: number) {
    this.page = pageOptionsDto.page ?? 1; // Default to 1 
    this.take = pageOptionsDto.take ?? 10; // Default to 10 
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}