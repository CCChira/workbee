"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskTemplatesModule = void 0;
const common_1 = require("@nestjs/common");
const tasktemplates_controller_1 = require("./tasktemplates.controller");
const tasktemplates_service_1 = require("./tasktemplates.service");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
let TaskTemplatesModule = class TaskTemplatesModule {
};
exports.TaskTemplatesModule = TaskTemplatesModule;
exports.TaskTemplatesModule = TaskTemplatesModule = __decorate([
    (0, common_1.Module)({
        controllers: [tasktemplates_controller_1.TaskTemplatesController],
        providers: [tasktemplates_service_1.TaskTemplatesService, prisma_service_1.PrismaService, jwt_1.JwtService],
    })
], TaskTemplatesModule);
//# sourceMappingURL=tasktemplates.module.js.map