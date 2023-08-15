import {Entity, model, property, hasMany} from '@loopback/repository';
import { User } from "@loopback/authentication-jwt";
import {Movie} from './movie.model';

@model()
export class NewUser extends User {

  // @property({
  //   type: 'string ',
  //   id: true,
  //   generated: true,
  // })
  // id?: string |undefined;

  

  @hasMany(() => Movie)
  movies: Movie[];

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;


  constructor(data?: Partial<NewUser>) {
    super(data);
  }
}

export interface NewUserRelations {
  // describe navigational properties here
}

export type NewUserWithRelations = NewUser & NewUserRelations;
