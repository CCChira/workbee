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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const swagger_1 = require("@nestjs/swagger");
const auth_entity_1 = require("./entity/auth.entity");
const login_dto_1 = require("./dto/login.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login({ email, password }, request, res) {
        try {
            const authEntity = await this.authService.login(email, password);
            res
                .cookie('access_token', authEntity.accessToken)
                .cookie('refresh_token', authEntity.refreshToken)
                .send(authEntity);
        }
        catch (e) {
            switch (e.status) {
                case common_1.HttpStatus.NOT_FOUND:
                    throw new common_1.NotFoundException(e.message);
                case common_1.HttpStatus.FORBIDDEN:
                    throw new common_1.ForbiddenException(e.message);
                default:
                    throw new common_1.NotFoundException('There was a problem authenticating');
            }
        }
    }
    async refresh(res, req) {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            throw new common_1.ForbiddenException('No refresh token provided');
        }
        const { id: userId, role: userRole } = await this.authService.validateToken(refreshToken);
        const newAccessToken = await this.authService.createAccessToken(userId, userRole);
        const newRefreshToken = await this.authService.createRefreshToken(userId, userRole);
        res.cookie('refresh_token', newRefreshToken);
        res.cookie('access_token', newAccessToken);
    }
    test() {
        return 'test';
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOkResponse)({ type: auth_entity_1.AuthEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "test", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map