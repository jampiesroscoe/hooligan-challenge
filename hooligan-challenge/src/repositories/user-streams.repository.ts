import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {UserStreams} from '../models';

export class UserStreamsRepository extends DefaultCrudRepository<
  UserStreams,
  typeof UserStreams.prototype.userId
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(UserStreams, dataSource);
  }
}
