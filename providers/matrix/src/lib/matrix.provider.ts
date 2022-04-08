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

  constructor(private config: { opts: Matrix.ICreateClientOpts | string }) {
    this.matrixClient = Matrix.createClient(config.opts);
  }

  async connect(options?: Matrix.IRoomDirectoryOptions): Promise<void> {
    await this.matrixClient.publicRooms(options);
    await this.matrixClient.startClient({ initialSyncLimit: 10 });
    await new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.matrixClient.once('sync', function (state, _prevState, result) {
        if (state === 'PREPARED') {
          resolve(result);
        } else {
          reject(state);
        }
      });
    });
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
