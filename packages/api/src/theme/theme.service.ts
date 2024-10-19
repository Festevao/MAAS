import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Theme } from './schemas/theme.schema';
import { Model } from 'mongoose';

@Injectable()
export class ThemeService {
  constructor(
    @InjectModel(Theme.name)
    private themeModel: Model<Theme>,
  ) {}

  async findAll() {
    return this.themeModel.find().exec();
  }
}
