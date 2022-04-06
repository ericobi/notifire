import {
  ChannelTypeEnum,
  ISendMessageSuccessResponse,
  ISmsOptions,
  ISmsProvider,
} from '@novu/node';

import * as Matrix from 'matrix-js-sdk';

export class MatrixSmsProvider implements ISmsProvider {
  id = 'matrix';
  channelType = ChannelTypeEnum.SMS as ChannelTypeEnum.SMS;
  private matrixClient: Matrix.MatrixClient;

  constructor(config: { opts: Matrix.ICreateClientOpts | string }) {
    this.matrixClient = Matrix.createClient(config.opts);
  }

  async sendMessage(
    options: ISmsOptions
  ): Promise<ISendMessageSuccessResponse> {
    const matrixResponse = await this.matrixClient.sendEvent(
      options.to,
      'm.room.message',
      {
        body: options.content,
        msgtype: 'm.text',
      },
      ''
    );

    return {
      id: matrixResponse.event_id,
      date: new Date().toISOString(),
    };
  }
}
