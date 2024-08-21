import { DocumentBuilder, OpenAPIObject } from "@nestjs/swagger";

export const SwaggerDocumentService = (): Omit<OpenAPIObject, "paths"> => {
    return new DocumentBuilder()
    .setTitle('Tutorials')
    .setDescription('api responsible for managing tutorials')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
}