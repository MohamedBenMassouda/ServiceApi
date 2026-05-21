import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationsController } from "./notifications/notifications.controller";
import { NotificationsHttpController } from "./notifications/notifications.http.controller";
import { NotificationsService } from "./notifications/notifications.service";
import { Notification } from "./notifications/notification.entity";
import { SeederService } from "./database/seeder.service";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "notifications.sqlite",
      entities: [Notification],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Notification]),
  ],
  controllers: [NotificationsController, NotificationsHttpController],
  providers: [NotificationsService, SeederService],
})
export class AppModule {}
