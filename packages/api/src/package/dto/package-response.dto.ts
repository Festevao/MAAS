import { Package } from '../entities/package.entity';

export class PackageResponseDTO {
  name: string;
  themes: string[];
  version: number;
  
  constructor(args: Package) {
    this.name = args.name;
    this.themes = args.themes;
    this.version = args.version;
  }
}