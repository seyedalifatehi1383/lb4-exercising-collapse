import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {NewUser, NewUserRelations, Movie} from '../models';
import {MovieRepository} from './movie.repository';

export class NewUserRepository extends DefaultCrudRepository<
  NewUser,
  typeof NewUser.prototype.id,
  NewUserRelations
> {

  public readonly movies: HasManyRepositoryFactory<Movie, typeof NewUser.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('MovieRepository') protected movieRepositoryGetter: Getter<MovieRepository>,
  ) {
    super(NewUser, dataSource);
    this.movies = this.createHasManyRepositoryFactoryFor('movies', movieRepositoryGetter,);
    this.registerInclusionResolver('movies', this.movies.inclusionResolver);
  }
}
