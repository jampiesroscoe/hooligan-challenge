import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {UserStreams, UserStreamsRelations} from '../models';

export class UserStreamsRepository extends DefaultCrudRepository<
  UserStreams,
  typeof UserStreams.prototype.userId,
  UserStreamsRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(UserStreams, dataSource);
  }
}
