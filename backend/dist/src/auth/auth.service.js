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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const uuid_1 = require("uuid");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async createAccessToken(userId, role) {
        console.log(await this.jwtService.sign({ id: userId, role }, { expiresIn: '1h' }));
        return this.jwtService.sign({ id: userId, role }, { expiresIn: '1h' });
    }
    async createRefreshToken(userId, role) {
        const token = (0, uuid_1.v4)();
        return this.jwtService.sign({ id: userId, tokenId: token, role: role }, { expiresIn: '7d' });
    }
    async validateToken(token) {
        const { id } = this.jwtService.decode(token);
        return this.prisma.user.findUnique({ where: { id } });
    }
    async login(email, password) {
        console.log(email, password);
        const user = await this.prisma.user.findFirst({ where: { email: email } });
        if (!user) {
            throw new common_1.NotFoundException({
                message: `Invalid email or password`,
                status: common_1.HttpStatus.NOT_FOUND,
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException({
                message: 'Invalid email or password',
                status: common_1.HttpStatus.FORBIDDEN,
            });
        }
        const accessToken = await this.createAccessToken(user.id, user.role);
        const refreshToken = await this.createRefreshToken(user.id, user.role);
        return {
            accessToken,
            refreshToken,
            id: user.id,
            email: user.email,
            role: user.role,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map