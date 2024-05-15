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
exports.TokenRefreshMiddleware = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth/auth.service");
const jwt_1 = require("@nestjs/jwt");
const uuid_1 = require("uuid");
let TokenRefreshMiddleware = class TokenRefreshMiddleware {
    constructor(authService, jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }
    async use(req, res, next) {
        const accessToken = req.cookies['access_token'];
        const refreshToken = req.cookies['refresh_token'];
        if (!accessToken && refreshToken) {
            try {
                const decoded = this.jwtService.verify(refreshToken, {
                    secret: 'zjP9h6ZI5LoSKCRj',
                });
                console.log(decoded);
                const newAccessToken = this.jwtService.sign({ id: decoded.id, role: decoded.role }, { expiresIn: '1h', secret: 'zjP9h6ZI5LoSKCRj' });
                const newRefreshToken = this.jwtService.sign({ id: decoded.id, tokenId: (0, uuid_1.v4)(), role: decoded.role }, { expiresIn: '7d', secret: 'zjP9h6ZI5LoSKCRj' });
                res.cookie('access_token', newAccessToken, {
                    httpOnly: true,
                    maxAge: 3600000,
                });
                res.cookie('refresh_token', newRefreshToken, {
                    httpOnly: true,
                    maxAge: 604800000,
                });
                req.cookies['access_token'] = newAccessToken;
                req.cookies['refresh_token'] = newRefreshToken;
                next();
            }
            catch (error) {
                console.error('Token refresh error:', error);
                throw new common_1.UnauthorizedException('Session has expired, please log in again');
            }
        }
        else {
            next();
        }
    }
};
exports.TokenRefreshMiddleware = TokenRefreshMiddleware;
exports.TokenRefreshMiddleware = TokenRefreshMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_1.JwtService])
], TokenRefreshMiddleware);
//# sourceMappingURL=tokenRefresh.middleware.js.map