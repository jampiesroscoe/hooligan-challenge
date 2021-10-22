import {Model, model, property} from '@loopback/repository';

@model()
export class StreamsResponse extends Model {
  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'number',
    required: true,
  })
  noOfStreams: number;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  sessionIds: string[];

  @property({
    type: 'boolean',
    required: true,
  })
  allow: boolean;

  constructor(data?: Partial<StreamsResponse>) {
    super(data);
  }
}
