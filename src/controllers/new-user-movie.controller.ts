import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  NewUser,
  Movie,
} from '../models';
import {NewUserRepository} from '../repositories';
// ---------- ADD IMPORTS -------------
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
// ------------------------------------
import {SecurityBindings, UserProfile ,securityId} from '@loopback/security';

@authenticate('jwt') // <---- Apply the @authenticate decorator at the class level
export class NewUserMovieController {
  constructor(
    @repository(NewUserRepository) protected newUserRepository: NewUserRepository,
  ) { }

  @get('/new-users/movies', {
    responses: {
      '200': {
        description: 'Array of NewUser has many Movie',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Movie)},
          },
        },
      },
    },
  })
  async find(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.query.object('filter') filter?: Filter<Movie>,
  ): Promise<Movie[]> {
    return this.newUserRepository.movies(currentUserProfile[securityId]).find(filter);
  }

  @post('/new-users/movies', {
    responses: {
      '200': {
        description: 'NewUser model instance',
        content: {'application/json': {schema: getModelSchemaRef(Movie)}},
      },
    },
  })
  async create(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Movie, {
            title: 'NewMovieInNewUser',
            exclude: ['id' , 'newUserId'],
            optional: ['newUserId']
          }),
        },
      },
    }) movie: Omit<Movie, 'id'>,
  ): Promise<any> {
    movie.newUserId = currentUserProfile[securityId]
    return this.newUserRepository.movies(currentUserProfile[securityId]).create(movie);
    // return currentUserProfile[securityId]
  }

  @patch('/new-users/{id}/movies', {
    responses: {
      '200': {
        description: 'NewUser.Movie PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Movie, {partial: true}),
        },
      },
    })
    movie: Partial<Movie>,
    @param.query.object('where', getWhereSchemaFor(Movie)) where?: Where<Movie>,
  ): Promise<Count> {
    return this.newUserRepository.movies(id).patch(movie, where);
  }

  @del('/new-users/{id}/movies', {
    responses: {
      '200': {
        description: 'NewUser.Movie DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Movie)) where?: Where<Movie>,
  ): Promise<Count> {
    return this.newUserRepository.movies(id).delete(where);
  }
}
