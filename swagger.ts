import swaggerJsdoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "College API",
        version: "1.0.0",
        description: "API for CollegeExam",
    },
    servers: [
        {
            url: "http://localhost:3000",
        },
    ],
};

const options = {
    definition: swaggerDefinition,
    apis: ["./dist/routes/*.js", "./server.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
