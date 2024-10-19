import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MovieViewDocument = HydratedDocument<MovieView>;

@Schema()
export class MovieView {
  @Prop()
  externalId: string;

  @Prop()
  userId: string;
}

export const MovieViewSchema = SchemaFactory.createForClass(MovieView);