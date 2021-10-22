import {Client, expect} from '@loopback/testlab';
import {StreamApplication} from '../..';
import {setupApplication} from './test-helper';

describe('UserStreamsController', () => {
  let app: StreamApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    await client.del('/user-streams/test');
  });

  after(async () => {
    await client.del('/user-streams/test');
    await app.stop();
  });

  describe('/user-streams/{userId}/{sessionId}', () => {
    it('create initial user and first stream, should allow stream', async () => {
      const res = await client.get('/user-streams/test/1').expect(200);
      expect(res.body.noOfStreams).to.equal(1);
      expect(res.body.userId).to.equal('test');
      expect(res.body.allow).to.equal(true);
    });
    it('add second stream for user, should allow stream', async () => {
      const res = await client.get('/user-streams/test/2').expect(200);
      expect(res.body.noOfStreams).to.equal(2);
      expect(res.body.userId).to.equal('test');
      expect(res.body.allow).to.equal(true);
    });
    it('add third stream for user, should not allow stream', async () => {
      const res = await client.get('/user-streams/test/3').expect(200);
      expect(res.body.noOfStreams).to.equal(3);
      expect(res.body.userId).to.equal('test');
      expect(res.body.allow).to.equal(true);
    });
    it('add fourth stream for user, should not allow stream', async () => {
      const res = await client.get('/user-streams/test/4').expect(200);
      expect(res.body.noOfStreams).to.equal(3);
      expect(res.body.userId).to.equal('test');
      expect(res.body.allow).to.equal(false);
    });
    it('user initates new stream from same session, should allow stream', async () => {
      const res = await client.get('/user-streams/test/1').expect(200);
      expect(res.body.noOfStreams).to.equal(3);
      expect(res.body.userId).to.equal('test');
      expect(res.body.allow).to.equal(true);
    });
  });
});
