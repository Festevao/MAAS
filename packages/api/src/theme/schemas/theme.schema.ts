import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ThemeDocument = HydratedDocument<Theme>;

@Schema()
export class Theme {
  @Prop()
  name: string;

  @Prop()
  externalId: string;
}

export const ThemeSchema = SchemaFactory.createForClass(Theme);