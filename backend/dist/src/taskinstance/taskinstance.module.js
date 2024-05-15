"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskinstanceModule = void 0;
const common_1 = require("@nestjs/common");
const taskinstance_service_1 = require("./taskinstance.service");
const taskinstance_controller_1 = require("./taskinstance.controller");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const requests_service_1 = require("../requests/requests.service");
let TaskinstanceModule = class TaskinstanceModule {
};
exports.TaskinstanceModule = TaskinstanceModule;
exports.TaskinstanceModule = TaskinstanceModule = __decorate([
    (0, common_1.Module)({
        providers: [taskinstance_service_1.TaskinstanceService, jwt_1.JwtService, prisma_service_1.PrismaService, requests_service_1.RequestsService],
        controllers: [taskinstance_controller_1.TaskinstanceController],
    })
], TaskinstanceModule);
//# sourceMappingURL=taskinstance.module.js.map