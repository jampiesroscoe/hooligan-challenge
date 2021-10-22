import {Entity, model, property} from '@loopback/repository';

@model()
export class UserStreams extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  userId: string;

  @property({
    type: 'array',
    itemType: 'object',
    required: true,
  })
  streamInformation: object[];

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  sessionIds: string[];

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  streamIds: string[];

  constructor(data?: Partial<UserStreams>) {
    super(data);
  }
}

export interface UserStreamsRelations {
  // describe navigational properties here
}

export type UserStreamsWithRelations = UserStreams & UserStreamsRelations;
