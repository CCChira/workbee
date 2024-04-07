"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagSortApiQuery = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
function PagSortApiQuery() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number',
    }), (0, swagger_1.ApiQuery)({
        name: 'size',
        required: false,
        type: Number,
        description: 'Number of items per page',
    }), (0, swagger_1.ApiQuery)({
        name: 'sort:order',
        required: false,
        type: String,
        description: 'Sort column',
    }));
}
exports.PagSortApiQuery = PagSortApiQuery;
//# sourceMappingURL=PagSortApiQuery.decorator.js.map