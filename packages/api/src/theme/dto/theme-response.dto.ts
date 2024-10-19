import { Theme } from '../schemas/theme.schema';

export class ThemeResponseDTO {
  name: string;
  externalId: string;

  constructor(args: Theme) {
    this.name = args.name;
    this.externalId = args.externalId;
  }
}