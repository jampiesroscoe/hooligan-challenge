import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef, del, response} from '@loopback/rest';
import {StreamsResponse, UserStreams} from '../models';
import {UserStreamsRepository} from '../repositories';

export class UserStreamsController {
  constructor(
    @repository(UserStreamsRepository)
    public userStreamsRepository: UserStreamsRepository,
  ) {}

  @get('/user-streams/{userId}/{sessionId}')
  @response(200, {
    description: 'Number of streams user is watching',
    content: {
      'application/json': {
        schema: getModelSchemaRef(StreamsResponse),
      },
    },
  })
  async getUserStreamsV1(
    @param.path.string('userId') id: string,
    @param.path.string('sessionId') sessionId: string,
  ) {
    let userInfo: UserStreams;

    try {
      userInfo = await this.userStreamsRepository.findById(id);
    } catch (error) {
      const freshUser = new UserStreams({
        userId: id,
        sessionIds: [sessionId],
        noOfStreams: 1,
      });

      await this.userStreamsRepository.create(freshUser);

      return new StreamsResponse({
        userId: id,
        noOfStreams: freshUser.noOfStreams,
        sessionIds: freshUser.sessionIds,
        allow: true,
      });
    }

    if (
      userInfo.noOfStreams === 3 &&
      !userInfo.sessionIds.includes(sessionId)
    ) {
      return new StreamsResponse({
        userId: id,
        noOfStreams: userInfo.noOfStreams,
        sessionIds: userInfo.sessionIds,
        allow: false,
      });
    } else if (userInfo.sessionIds.includes(sessionId)) {
      return new StreamsResponse({
        userId: id,
        noOfStreams: userInfo.noOfStreams,
        sessionIds: userInfo.sessionIds,
        allow: true,
      });
    } else {
      userInfo.sessionIds.push(sessionId);
      userInfo.noOfStreams++;
      await this.userStreamsRepository.updateById(id, userInfo);
      return new StreamsResponse({
        userId: id,
        noOfStreams: userInfo.noOfStreams,
        sessionIds: userInfo.sessionIds,
        allow: true,
      });
    }
  }

  @del('/user-streams/{userId}')
  @response(204, {
    description: 'UserStreams DELETE success',
  })
  async deleteById(@param.path.string('userId') id: string): Promise<void> {
    await this.userStreamsRepository.deleteById(id);
  }
}
