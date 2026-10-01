import { Module } from '@nestjs/common';
import MessageBuilder from '@janindu-pathirana/message-builder';

@Module({
  providers: [
    {
      provide: MessageBuilder,
      useValue: new MessageBuilder(),
    },
  ],
  exports: [MessageBuilder],
})
export class MessageBuilderModule {}
