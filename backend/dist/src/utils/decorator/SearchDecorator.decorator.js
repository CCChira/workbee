"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchApiQuery = exports.SearchDecorator = exports.Search = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
class Search {
}
exports.Search = Search;
exports.SearchDecorator = (0, common_1.createParamDecorator)((validParams, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    const search = req.query['search'];
    if (!search)
        return { field: '', searchParam: '' };
    const [field, searchParam] = search.split(':');
    if (!validParams.includes(field))
        throw new common_1.BadRequestException(`invalid sort property: ${field}`);
    return { field, searchParam };
});
function SearchApiQuery() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBody)({
        required: false,
        type: Search,
        description: 'search params',
    }));
}
exports.SearchApiQuery = SearchApiQuery;
//# sourceMappingURL=SearchDecorator.decorator.js.map