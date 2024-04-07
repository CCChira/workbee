"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationParamsDecorator = void 0;
const common_1 = require("@nestjs/common");
exports.PaginationParamsDecorator = (0, common_1.createParamDecorator)((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);
    if (req.query.page === undefined || req.query.size === undefined) {
        return { page: 0, limit: 100, size: 100, offset: 0 };
    }
    if (isNaN(page) || page < 0 || isNaN(size) || size < 0) {
        throw new common_1.BadRequestException('Invalid pagination params');
    }
    if (size > 100) {
        throw new common_1.BadRequestException('Invalid pagination params: Max size is 100');
    }
    const limit = size;
    const offset = page * limit;
    return { page, limit, size, offset };
});
//# sourceMappingURL=paginationParams.decorator.js.map