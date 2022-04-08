import { MatrixSmsProvider } from './matrix.provider';

test('should trigger Twilio correctly', async () => {
  const provider = new MatrixSmsProvider({ opts: 'https://matrix.org' });
  const spy = jest
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .spyOn(provider.matrixClient.on, 'Room.timeline');

  await provider.sendMessage({
    to: 'matrix:@example.com',
    content: 'SMS Content',
  });

  expect(spy).toHaveBeenCalled();
  expect(spy).toHaveBeenCalledWith(
    {
      eventType: 'm.room.message',
      content: {
        body: 'SMS Content',
      },
    },
    'matrix:@example.com'
  );
});
