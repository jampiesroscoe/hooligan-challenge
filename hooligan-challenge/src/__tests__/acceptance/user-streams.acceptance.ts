import {Client} from '@loopback/testlab';
import {StreamApplication} from '../..';
import {setupApplication} from './test-helper';

describe('UserStreamsController', () => {
  let app: StreamApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('/user-streams/{userId}/{sessionId}/{streamId}', async () => {
    await client.get('/user-streams/1/1/1').expect(200);
  });
});
