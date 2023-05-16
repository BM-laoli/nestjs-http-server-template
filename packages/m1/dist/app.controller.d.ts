import { MqttContext, NatsContext, RedisContext, RequestContext, RmqContext } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { KafkaMessage } from 'kafkajs';
interface Dragon {
    id: number;
    name: string;
}
type KillDragonMessage = Omit<KafkaMessage, 'value'> & {
    value: Pick<Dragon, 'id'>;
};
export declare class AppController {
    private readonly appService;
    private ctx;
    constructor(appService: AppService, ctx: RequestContext);
    private readonly logger;
    private readonly dragons;
    accumulate(data: number[]): number;
    accumulateSync(data: number[]): Promise<number>;
    accumulateObservable(data: number[]): Observable<number>;
    cuser(data: any): Promise<number>;
    cuser2(data: any): Promise<number>;
    getDate(data: number[], context: NatsContext): string;
    getNotifications(data: number[], context: RedisContext): void;
    getNotificationsMQTT(data: number[], context: MqttContext): void;
    replaceEmoji(data: string, context: MqttContext): string;
    notificationsNATS(data: number[], context: NatsContext): void;
    replaceEmojiNATS(data: string, context: NatsContext): string;
    getNotificationsRMQ(data: number[], context: RmqContext): string;
    replaceEmojiRMQ(data: string, context: RmqContext): string;
    onKillDragon(message: KillDragonMessage): {
        id: number;
        name: string;
    };
}
export {};
