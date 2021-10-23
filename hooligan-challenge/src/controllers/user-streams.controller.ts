import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef, del, response} from '@loopback/rest';
import {StreamsResponse, UserStreams} from '../models';
import {UserStreamsRepository} from '../repositories';
import {log} from '../helpers';

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
  ): Promise<StreamsResponse> {
    let userInfo: UserStreams;

    log.info(`User streams request: userId: ${id} sessionId: ${sessionId}`);

    try {
      userInfo = await this.userStreamsRepository.findById(id);
    } catch (error) {
      log.info('No current streams found for userId: ' + id);
      const freshUser = new UserStreams({
        userId: id,
        sessionIds: [sessionId],
        noOfStreams: 1,
      });

      await this.userStreamsRepository.create(freshUser);
      log.info(`new stream created for userId: ${id} sessionId: ${sessionId}`);

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
      log.info(`Maximun amout of streams reached for userId ${id}`);
      return new StreamsResponse({
        userId: id,
        noOfStreams: userInfo.noOfStreams,
        sessionIds: userInfo.sessionIds,
        allow: false,
      });
    } else if (userInfo.sessionIds.includes(sessionId)) {
      log.info(
        `User iniated stream from existing session, userId: ${id} sessionId:${sessionId}`,
      );
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
      log.info(`New stream created for userId: ${id} sessionId: ${sessionId}`);
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
