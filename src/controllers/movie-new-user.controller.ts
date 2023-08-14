import {
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
import {MovieRepository} from '../repositories';

export class MovieNewUserController {
  constructor(
    @repository(MovieRepository)
    public movieRepository: MovieRepository,
  ) { }

  @get('/movies/{id}/new-user', {
    responses: {
      '200': {
        description: 'NewUser belonging to Movie',
        content: {
          'application/json': {
            schema: getModelSchemaRef(NewUser),
          },
        },
      },
    },
  })
  async getNewUser(
    @param.path.number('id') id: typeof Movie.prototype.id,
  ): Promise<NewUser> {
    return this.movieRepository.newUser(id);
  }
}
