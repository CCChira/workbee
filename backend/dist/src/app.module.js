"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const contracts_module_1 = require("./contracts/contracts.module");
const tasktemplates_module_1 = require("./tasktemplates/tasktemplates.module");
const locations_module_1 = require("./locations/locations.module");
const rooms_module_1 = require("./rooms/rooms.module");
const tokenRefresh_middleware_1 = require("./middleware/tokenRefresh.middleware");
const auth_service_1 = require("./auth/auth.service");
const jwt_1 = require("@nestjs/jwt");
const jwt_strategy_1 = require("./auth/strategy/jwt.strategy");
const aws_s3_service_1 = require("./services/aws-s3.service");
const createImage_service_1 = require("./services/createImage.service");
const taskschedules_module_1 = require("./taskschedules/taskschedules.module");
const requests_module_1 = require("./requests/requests.module");
const taskinstance_module_1 = require("./taskinstance/taskinstance.module");
const config_1 = require("@nestjs/config");
const twilio_service_1 = require("./services/twilio.service");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(tokenRefresh_middleware_1.TokenRefreshMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            contracts_module_1.ContractsModule,
            tasktemplates_module_1.TaskTemplatesModule,
            locations_module_1.LocationsModule,
            rooms_module_1.RoomsModule,
            taskschedules_module_1.TaskschedulesModule,
            requests_module_1.RequestsModule,
            taskinstance_module_1.TaskinstanceModule,
            config_1.ConfigModule.forRoot({ isGlobal: true }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            auth_service_1.AuthService,
            jwt_1.JwtService,
            jwt_strategy_1.JwtStrategy,
            aws_s3_service_1.AwsS3Service,
            createImage_service_1.PrismaImageService,
            twilio_service_1.TwilioService,
        ],
        exports: [aws_s3_service_1.AwsS3Service],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map