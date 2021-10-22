import {repository} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  del,
  response,
  post,
  requestBody,
} from '@loopback/rest';
import {UserStreams} from '../models';
import {UserStreamsRepository} from '../repositories';

export class UserStreamsController {
  constructor(
    @repository(UserStreamsRepository)
    public userStreamsRepository: UserStreamsRepository,
  ) {}

  @get('/user-streams/{userId}/{sessionId}/{streamId}')
  @response(200, {
    description: 'Get number of streams user is watching',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserStreams, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('userId') id: string,
    @param.path.string('sessionId') sessionId: string,
    @param.path.string('streamId') streamId: string,
  ): Promise<UserStreams> {
    return this.userStreamsRepository.findById(id);
  }

  @post('/user-streams')
  @response(200, {
    description: 'UserStreams model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserStreams)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserStreams, {
            title: 'NewUserStreams',
          }),
        },
      },
    })
    userStreams: UserStreams,
  ): Promise<UserStreams> {
    return this.userStreamsRepository.create(userStreams);
  }

  @del('/user-streams/{id}')
  @response(204, {
    description: 'UserStreams DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userStreamsRepository.deleteById(id);
  }
}
