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
    itemType: 'string',
    required: true,
  })
  sessionIds: string[];

  @property({
    type: 'number',
    required: true,
  })
  noOfStreams: number;

  constructor(data?: Partial<UserStreams>) {
    super(data);
  }
}
