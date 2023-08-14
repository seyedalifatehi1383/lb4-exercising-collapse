import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Movie, MovieRelations, NewUser} from '../models';
import {NewUserRepository} from './new-user.repository';

export class MovieRepository extends DefaultCrudRepository<
  Movie,
  typeof Movie.prototype.id,
  MovieRelations
> {

  public readonly newUser: BelongsToAccessor<NewUser, typeof Movie.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('NewUserRepository') protected newUserRepositoryGetter: Getter<NewUserRepository>,
  ) {
    super(Movie, dataSource);
    this.newUser = this.createBelongsToAccessorFor('newUser', newUserRepositoryGetter,);
    this.registerInclusionResolver('newUser', this.newUser.inclusionResolver);
  }
}
