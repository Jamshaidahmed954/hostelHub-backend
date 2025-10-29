import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

import { HostelModule } from './hostel/hostel.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/hostelHub'),
    AuthModule,
    HostelModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
