import {Entity, model, property, belongsTo} from '@loopback/repository';
import {NewUser} from './new-user.model';

@model()
export class Movie extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  genre: string;

  @property({
    type: 'string',
    required: true,
  })
  director: string;

  @property({
    type: 'number',
    required: true,
  })
  yearReleased: number;

  @belongsTo(() => NewUser)
  newUserId: string;

  constructor(data?: Partial<Movie>) {
    super(data);
  }
}

export interface MovieRelations {
  // describe navigational properties here
}

export type MovieWithRelations = Movie & MovieRelations;
