"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('WorkBee')
        .setDescription('The WorkBee API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    app.use(cookieParser());
    app.setGlobalPrefix('api');
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    await app.listen(3001);
}
bootstrap();
//# sourceMappingURL=main.js.map