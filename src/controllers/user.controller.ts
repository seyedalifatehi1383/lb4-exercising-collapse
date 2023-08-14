import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {NewUser} from '../models';
import {NewUserRepository} from '../repositories';

export class UserController {
  constructor(
    @repository(NewUserRepository)
    public newUserRepository : NewUserRepository,
  ) {}

  @post('/new-users')
  @response(200, {
    description: 'NewUser model instance',
    content: {'application/json': {schema: getModelSchemaRef(NewUser)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUser, {
            title: 'NewNewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    newUser: Omit<NewUser, 'id'>,
  ): Promise<NewUser> {
    return this.newUserRepository.create(newUser);
  }

  @get('/new-users/count')
  @response(200, {
    description: 'NewUser model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(NewUser) where?: Where<NewUser>,
  ): Promise<Count> {
    return this.newUserRepository.count(where);
  }

  @get('/new-users')
  @response(200, {
    description: 'Array of NewUser model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(NewUser, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(NewUser) filter?: Filter<NewUser>,
  ): Promise<NewUser[]> {
    return this.newUserRepository.find(filter);
  }

  @patch('/new-users')
  @response(200, {
    description: 'NewUser PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUser, {partial: true}),
        },
      },
    })
    newUser: NewUser,
    @param.where(NewUser) where?: Where<NewUser>,
  ): Promise<Count> {
    return this.newUserRepository.updateAll(newUser, where);
  }

  @get('/new-users/{id}')
  @response(200, {
    description: 'NewUser model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(NewUser, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(NewUser, {exclude: 'where'}) filter?: FilterExcludingWhere<NewUser>
  ): Promise<NewUser> {
    return this.newUserRepository.findById(id, filter);
  }

  @patch('/new-users/{id}')
  @response(204, {
    description: 'NewUser PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUser, {partial: true}),
        },
      },
    })
    newUser: NewUser,
  ): Promise<void> {
    await this.newUserRepository.updateById(id, newUser);
  }

  @put('/new-users/{id}')
  @response(204, {
    description: 'NewUser PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() newUser: NewUser,
  ): Promise<void> {
    await this.newUserRepository.replaceById(id, newUser);
  }

  @del('/new-users/{id}')
  @response(204, {
    description: 'NewUser DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.newUserRepository.deleteById(id);
  }
}
