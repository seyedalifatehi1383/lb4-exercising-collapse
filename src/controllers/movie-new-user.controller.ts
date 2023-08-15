import {
  Filter,
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Movie,
  NewUser,
} from '../models';
import {MovieRepository } from '../repositories';
// ---------- ADD IMPORTS -------------
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {User , UserRepository} from '@loopback/authentication-jwt';
import _ from 'lodash';

// ------------------------------------
@authenticate('jwt') // <---- Apply the @authenticate decorator at the class level
export class MovieNewUserController {
  constructor(
    @repository(MovieRepository)
    public movieRepository: MovieRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @get('/movies/{name}/users', {
    responses: {
      '200': {
        description: 'NewUser belonging to Movie',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User,{
            }),
          },
        },
      },
    },
  })
  async getNewUser(
    @param.path.string('name') name:string,
    // @param.filter(NewUser) filter?: Filter<NewUser>,
  ): Promise<any> {
    // return this.movieRepository.newUser(id);
    const movesfind = await this.movieRepository.find({where : {name : name}})
    const users = []
    for (let index = 0; index < movesfind.length; index++) {
      users[index] = (await this.userRepository.findOne({where : {id : movesfind[index].newUserId}}).then(res => res?.email))

    }

    return {userEmails : users}
  }
}
