"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortingParamsDecorator = void 0;
const common_1 = require("@nestjs/common");
exports.SortingParamsDecorator = (0, common_1.createParamDecorator)((validParams, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    const sort = req.query['sort:order'];
    if (!sort)
        return null;
    const sortPattern = /^([a-zA-Z0-9]+):(asc|desc)$/;
    if (!sort.match(sortPattern))
        throw new common_1.BadRequestException('Invalid sort parameter');
    const [property, direction] = sort.split(':');
    console.log(validParams);
    if (!validParams.includes(property)) {
        throw new common_1.BadRequestException(`Invalid sort property: ${property}`);
    }
    return { property, direction };
});
//# sourceMappingURL=sortingParams.decorator.js.map