"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthDecorators = void 0;
const common_1 = require("@nestjs/common");
const role_guard_1 = require("./guard/role.guard");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("./roles.decorator");
const AuthDecorators = (roles) => (0, common_1.applyDecorators)((0, common_1.UseGuards)(role_guard_1.RolesGuard, jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)(), (0, roles_decorator_1.Roles)(...roles));
exports.AuthDecorators = AuthDecorators;
//# sourceMappingURL=AuthDecorators.decorator.js.map