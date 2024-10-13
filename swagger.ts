import swaggerJsdoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "College API",
        version: "1.0.0",
        description: "API for College",
    },
    servers: [
        {
            url: "http://localhost:3000",
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ["./routes/*.js", "./server.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
