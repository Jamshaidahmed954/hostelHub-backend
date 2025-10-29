import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HostelController } from './hostel.controller';
import { HostelService } from './hostel.service';
import { Hostel, HostelSchema } from './hostel.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hostel.name, schema: HostelSchema }]),
  ],
  controllers: [HostelController],
  providers: [HostelService],
})
export class HostelModule {}
