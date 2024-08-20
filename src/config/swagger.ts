import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";

export const SwaggerDocumentService = (): Omit<OpenAPIObject, "paths"> => {
    return new DocumentBuilder()
    .setTitle('Url Short')
    .setDescription('Api responsible for shortening urls')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
}