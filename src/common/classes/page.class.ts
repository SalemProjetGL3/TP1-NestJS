import { PageMeta } from './page-meta.class';

export class Page<T> {
  readonly data: T[];
  readonly meta: PageMeta;

  constructor(data: T[], meta: PageMeta) {
    this.data = data;
    this.meta = meta;
  }
}