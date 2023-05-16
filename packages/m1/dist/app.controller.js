"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AppController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const app_service_1 = require("./app.service");
const util = require("util");
let AppController = AppController_1 = class AppController {
    constructor(appService, ctx) {
        this.appService = appService;
        this.ctx = ctx;
        this.logger = new common_1.Logger(AppController_1.name);
        this.dragons = [
            { id: 1, name: 'Smaug' },
            { id: 2, name: 'Ancalagon The Black' },
            { id: 3, name: 'Glaurung' },
        ];
    }
    accumulate(data) {
        return (data || []).reduce((a, b) => a + b);
    }
    accumulateSync(data) {
        return Promise.resolve((data || []).reduce((a, b) => a + b));
    }
    accumulateObservable(data) {
        return (0, rxjs_1.from)([1, 2, 3, 4]);
    }
    async cuser(data) {
        console.log(this.ctx.pattern);
        return 1;
    }
    async cuser2(data) {
        return 2;
    }
    getDate(data, context) {
        return new Date().toLocaleDateString();
    }
    getNotifications(data, context) {
        console.log(`Channel: ${context.getChannel()}`);
        console.log(222);
    }
    getNotificationsMQTT(data, context) {
        console.log(`Topic: ${context.getTopic()}`);
        console.log(222);
        console.log(context.getPacket());
    }
    replaceEmoji(data, context) {
        const { properties: { userProperties }, } = context.getPacket();
        console.log('2');
        return userProperties['x-version'] === '1.0.0' ? '🐱' : '🐈';
    }
    notificationsNATS(data, context) {
        console.log(`Subject: ${context.getSubject()}`);
    }
    replaceEmojiNATS(data, context) {
        const headers = context.getHeaders();
        return headers.get('x-version') === '1.0.0' ? '🐱' : '🐈';
    }
    getNotificationsRMQ(data, context) {
        console.log(`Pattern: ${context.getPattern()}`);
        console.log(`Pattern: ${context.getMessage()}`);
        console.log(context.getChannelRef());
        console.log(data);
        context.getChannelRef().ack(context.getMessage());
        return '666';
    }
    replaceEmojiRMQ(data, context) {
        const { properties: { headers }, } = context.getMessage();
        return headers['x-version'] === '1.0.0' ? '🐱' : '🐈';
    }
    onKillDragon(message) {
        var _a, _b;
        this.logger.log(`[hero.kill.dragon] message = ${util.inspect(message)}`);
        const dragonId = (_b = (_a = message === null || message === void 0 ? void 0 : message.value) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null;
        if (!dragonId) {
            this.logger.error('Failed to determine Dragon ID');
            return;
        }
        const dragon = this.dragons.find(({ id }) => id === dragonId);
        if (!dragon) {
            this.logger.error('Failed to fetch dragon from the database!');
            return;
        }
        this.logger.log(`Hero killed ${dragon.name}!`);
        return dragon;
    }
};
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'sum' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Number)
], AppController.prototype, "accumulate", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'sumSync' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "accumulateSync", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'sumObservable' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", rxjs_1.Observable)
], AppController.prototype, "accumulateObservable", null);
__decorate([
    (0, microservices_1.EventPattern)('user_created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "cuser", null);
__decorate([
    (0, microservices_1.EventPattern)('user_created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "cuser2", null);
__decorate([
    (0, microservices_1.MessagePattern)('time.use.*'),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, microservices_1.NatsContext]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getDate", null);
__decorate([
    (0, microservices_1.MessagePattern)('notifications'),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, microservices_1.RedisContext]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getNotifications", null);
__decorate([
    (0, microservices_1.MessagePattern)('notificationsMQTT'),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, microservices_1.MqttContext]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getNotificationsMQTT", null);
__decorate([
    (0, microservices_1.MessagePattern)('replace-emoji'),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, microservices_1.MqttContext]),
    __metadata("design:returntype", String)
], AppController.prototype, "replaceEmoji", null);
__decorate([
    (0, microservices_1.MessagePattern)('notificationsNATS'),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, microservices_1.NatsContext]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "notificationsNATS", null);
__decorate([
    (0, microservices_1.MessagePattern)('replace-emoji-NATS'),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, microservices_1.NatsContext]),
    __metadata("design:returntype", String)
], AppController.prototype, "replaceEmojiNATS", null);
__decorate([
    (0, microservices_1.MessagePattern)('notificationsRMQ'),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, microservices_1.RmqContext]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getNotificationsRMQ", null);
__decorate([
    (0, microservices_1.MessagePattern)('replace-emoji-RMQ'),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, microservices_1.RmqContext]),
    __metadata("design:returntype", String)
], AppController.prototype, "replaceEmojiRMQ", null);
__decorate([
    (0, microservices_1.MessagePattern)('hero.kill.dragon'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "onKillDragon", null);
AppController = AppController_1 = __decorate([
    (0, common_1.Controller)({
        scope: common_1.Scope.REQUEST,
    }),
    __param(1, (0, common_1.Inject)(microservices_1.CONTEXT)),
    __metadata("design:paramtypes", [app_service_1.AppService, Object])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map