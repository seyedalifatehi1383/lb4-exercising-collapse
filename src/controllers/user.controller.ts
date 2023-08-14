import {inject} from '@loopback/core';
import {authenticate} from '@loopback/authentication';

import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';

import {
  TokenServiceBindings,
  MyUserService,
  UserServiceBindings,
  UserRepository,
  User,
  Credentials
} from '@loopback/authentication-jwt';

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
  SchemaObject,
} from '@loopback/rest';
import {NewUser} from '../models';
import {NewUserRepository} from '../repositories';
import {TokenService} from '@loopback/authentication';
import {SecurityBindings, UserProfile ,securityId} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';


// import {repository} from '@loopback/repository';





const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class UserController {
  constructor(
    @repository(NewUserRepository)
    public newUserRepository : NewUserRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}




  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUser, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUser,
  ): Promise<User> {
    const password = await hash(newUserRequest.password, await genSalt());
    const savedUser = await this.userRepository.create(
      _.omit(newUserRequest, 'password'),
    );

    await this.userRepository.userCredentials(savedUser.id).create({password});

    return savedUser;
  }



  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }



  @authenticate('jwt')
  @get('/whoAmI', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<string |undefined> {
    return currentUserProfile[securityId];
  }

  // @post('/new-users')
  // @response(200, {
  //   description: 'NewUser model instance',
  //   content: {'application/json': {schema: getModelSchemaRef(NewUser)}},
  // })
  // async create(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(NewUser, {
  //           title: 'NewNewUser',
  //           exclude: ['id'],
  //         }),
  //       },
  //     },
  //   })
  //   newUser: Omit<NewUser, 'id'>,
  // ): Promise<NewUser> {
  //   return this.newUserRepository.create(newUser);
  // }

  // @get('/new-users/count')
  // @response(200, {
  //   description: 'NewUser model count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async count(
  //   @param.where(NewUser) where?: Where<NewUser>,
  // ): Promise<Count> {
  //   return this.newUserRepository.count(where);
  // }

  // @get('/new-users')
  // @response(200, {
  //   description: 'Array of NewUser model instances',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(NewUser, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  // async find(
  //   @param.filter(NewUser) filter?: Filter<NewUser>,
  // ): Promise<NewUser[]> {
  //   return this.newUserRepository.find(filter);
  // }

  // @patch('/new-users')
  // @response(200, {
  //   description: 'NewUser PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(NewUser, {partial: true}),
  //       },
  //     },
  //   })
  //   newUser: NewUser,
  //   @param.where(NewUser) where?: Where<NewUser>,
  // ): Promise<Count> {
  //   return this.newUserRepository.updateAll(newUser, where);
  // }

  // @get('/new-users/{id}')
  // @response(200, {
  //   description: 'NewUser model instance',
  //   content: {
  //     'application/json': {
  //       schema: getModelSchemaRef(NewUser, {includeRelations: true}),
  //     },
  //   },
  // })
  // async findById(
  //   @param.path.string('id') id: string,
  //   @param.filter(NewUser, {exclude: 'where'}) filter?: FilterExcludingWhere<NewUser>
  // ): Promise<NewUser> {
  //   return this.newUserRepository.findById(id, filter);
  // }

  // @patch('/new-users/{id}')
  // @response(204, {
  //   description: 'NewUser PATCH success',
  // })
  // async updateById(
  //   @param.path.string('id') id: string,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(NewUser, {partial: true}),
  //       },
  //     },
  //   })
  //   newUser: NewUser,
  // ): Promise<void> {
  //   await this.newUserRepository.updateById(id, newUser);
  // }

  // @put('/new-users/{id}')
  // @response(204, {
  //   description: 'NewUser PUT success',
  // })
  // async replaceById(
  //   @param.path.string('id') id: string,
  //   @requestBody() newUser: NewUser,
  // ): Promise<void> {
  //   await this.newUserRepository.replaceById(id, newUser);
  // }

  // @del('/new-users/{id}')
  // @response(204, {
  //   description: 'NewUser DELETE success',
  // })
  // async deleteById(@param.path.string('id') id: string): Promise<void> {
  //   await this.newUserRepository.deleteById(id);
  // }
}
