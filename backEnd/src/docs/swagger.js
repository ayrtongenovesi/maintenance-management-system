import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const PORT = process.env.PORT || 3000;
const API_BASE = process.env.SWAGGER_SERVER_URL || `http://localhost:${PORT}`;

const swaggerDefinition = {
    openapi: '3.0.3',
    info: {
        title: 'API - Sistema de Gestión de Mantenimiento',
        version: '1.0.0',
        description: 'Documentación de endpoints del backend.'
    },
    servers: [
        {
            url: API_BASE,
            description: 'Servidor actual'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        schemas: {
            MessageResponse: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            },
            LoginRequest: {
                type: 'object',
                required: ['mail', 'password'],
                properties: {
                    mail: { type: 'string', format: 'email' },
                    password: { type: 'string' }
                }
            },
            RegisterRequest: {
                type: 'object',
                required: ['nombre', 'mail', 'password'],
                properties: {
                    nombre: { type: 'string' },
                    mail: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                    rol: { type: 'string', example: 'administrador' }
                }
            },
            LoginResponse: {
                type: 'object',
                properties: {
                    token: { type: 'string' },
                    usuario: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer' },
                            nombre: { type: 'string' },
                            mail: { type: 'string' },
                            rol: { type: 'string' }
                        }
                    }
                }
            },
            GenericEntity: {
                type: 'object',
                additionalProperties: true
            }
        }
    },
    tags: [
        { name: 'Auth', description: 'Autenticación y registro' },
        { name: 'Catálogo', description: 'ABM de entidades de catálogo' },
        { name: 'Usuarios', description: 'Gestión de usuarios' },
        { name: 'Órdenes de trabajo', description: 'Gestión de OT' }
    ],
    paths: {
        '/api/auth/register': {
            post: {
                tags: ['Auth'],
                summary: 'Registrar usuario',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/RegisterRequest' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Usuario registrado',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/MessageResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'Iniciar sesión',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/LoginRequest' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Login correcto',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/LoginResponse' }
                            }
                        }
                    },
                    401: { description: 'Credenciales inválidas' }
                }
            }
        },
        '/api/usuario': {
            get: {
                tags: ['Usuarios'],
                summary: 'Listar usuarios (admin)',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Listado de usuarios',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/GenericEntity' }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/usuario/create': {
            post: {
                tags: ['Usuarios'],
                summary: 'Crear usuario (admin)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/GenericEntity' }
                        }
                    }
                },
                responses: {
                    200: { description: 'Usuario creado' }
                }
            }
        },
        '/api/usuario/edit/{id}': {
            put: {
                tags: ['Usuarios'],
                summary: 'Editar usuario (admin)',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/GenericEntity' }
                        }
                    }
                },
                responses: {
                    200: { description: 'Usuario actualizado' }
                }
            }
        },
        '/api/usuario/delete/{id}': {
            delete: {
                tags: ['Usuarios'],
                summary: 'Eliminar usuario (admin)',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: {
                    200: { description: 'Usuario eliminado' }
                }
            }
        },
        '/api/ot': {
            get: {
                tags: ['Órdenes de trabajo'],
                summary: 'Listar órdenes de trabajo',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Listado de OT',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/GenericEntity' }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/ot/create': {
            post: {
                tags: ['Órdenes de trabajo'],
                summary: 'Crear OT (admin)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/GenericEntity' }
                        }
                    }
                },
                responses: {
                    200: { description: 'OT creada' }
                }
            }
        },
        '/api/ot/edit/{id}': {
            put: {
                tags: ['Órdenes de trabajo'],
                summary: 'Actualizar estado de OT',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/GenericEntity' }
                        }
                    }
                },
                responses: {
                    200: { description: 'OT actualizada' }
                }
            }
        },
        '/api/ot/delete/{id}': {
            delete: {
                tags: ['Órdenes de trabajo'],
                summary: 'Eliminar OT (admin)',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: {
                    200: { description: 'OT eliminada' }
                }
            }
        },
        '/api/activo': {
            get: {
                tags: ['Catálogo'],
                summary: 'Listar activos (admin)',
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Listado de activos' } }
            }
        },
        '/api/activo/create': {
            post: {
                tags: ['Catálogo'],
                summary: 'Crear activo (admin)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/GenericEntity' }
                        }
                    }
                },
                responses: { 200: { description: 'Activo creado' } }
            }
        },
        '/api/activo/edit/{id}': {
            put: {
                tags: ['Catálogo'],
                summary: 'Editar activo (admin)',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/GenericEntity' }
                        }
                    }
                },
                responses: { 200: { description: 'Activo actualizado' } }
            }
        },
        '/api/activo/delete/{id}': {
            delete: {
                tags: ['Catálogo'],
                summary: 'Eliminar activo (admin)',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: { 200: { description: 'Activo eliminado' } }
            }
        },
        '/api/piso': {
            get: {
                tags: ['Catálogo'],
                summary: 'Listar pisos (admin)',
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Listado de pisos' } }
            }
        },
        '/api/piso/create': {
            post: {
                tags: ['Catálogo'],
                summary: 'Crear piso (admin)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/GenericEntity' }
                        }
                    }
                },
                responses: { 200: { description: 'Piso creado' } }
            }
        },
        '/api/piso/edit/{id}': {
            put: {
                tags: ['Catálogo'],
                summary: 'Editar piso (admin)',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/GenericEntity' }
                        }
                    }
                },
                responses: { 200: { description: 'Piso actualizado' } }
            }
        },
        '/api/piso/delete/{id}': {
            delete: {
                tags: ['Catálogo'],
                summary: 'Eliminar piso (admin)',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: { 200: { description: 'Piso eliminado' } }
            }
        },
        '/api/sector': {
            get: {
                tags: ['Catálogo'],
                summary: 'Listar sectores (admin)',
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Listado de sectores' } }
            }
        },
        '/api/sector/create': {
            post: {
                tags: ['Catálogo'],
                summary: 'Crear sector (admin)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/GenericEntity' }
                        }
                    }
                },
                responses: { 200: { description: 'Sector creado' } }
            }
        },
        '/api/sector/edit/{id}': {
            put: {
                tags: ['Catálogo'],
                summary: 'Editar sector (admin)',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/GenericEntity' }
                        }
                    }
                },
                responses: { 200: { description: 'Sector actualizado' } }
            }
        },
        '/api/sector/delete/{id}': {
            delete: {
                tags: ['Catálogo'],
                summary: 'Eliminar sector (admin)',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: { 200: { description: 'Sector eliminado' } }
            }
        },
        '/api/edificio': {
            get: {
                tags: ['Catálogo'],
                summary: 'Listar edificios (admin)',
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Listado de edificios' } }
            }
        },
        '/api/edificio/create': {
            post: {
                tags: ['Catálogo'],
                summary: 'Crear edificio (admin)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/GenericEntity' }
                        }
                    }
                },
                responses: { 200: { description: 'Edificio creado' } }
            }
        },
        '/api/edificio/edit/{id}': {
            put: {
                tags: ['Catálogo'],
                summary: 'Editar edificio (admin)',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/GenericEntity' }
                        }
                    }
                },
                responses: { 200: { description: 'Edificio actualizado' } }
            }
        },
        '/api/edificio/delete/{id}': {
            delete: {
                tags: ['Catálogo'],
                summary: 'Eliminar edificio (admin)',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: { 200: { description: 'Edificio eliminado' } }
            }
        },
        '/api/ubicacion': {
            get: {
                tags: ['Catálogo'],
                summary: 'Listar ubicaciones (admin)',
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Listado de ubicaciones' } }
            }
        },
        '/api/ubicacion/create': {
            post: {
                tags: ['Catálogo'],
                summary: 'Crear ubicación (admin)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/GenericEntity' }
                        }
                    }
                },
                responses: { 200: { description: 'Ubicación creada' } }
            }
        },
        '/api/ubicacion/edit/{id}': {
            put: {
                tags: ['Catálogo'],
                summary: 'Editar ubicación (admin)',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/GenericEntity' }
                        }
                    }
                },
                responses: { 200: { description: 'Ubicación actualizada' } }
            }
        },
        '/api/ubicacion/delete/{id}': {
            delete: {
                tags: ['Catálogo'],
                summary: 'Eliminar ubicación (admin)',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: { 200: { description: 'Ubicación eliminada' } }
            }
        },
        '/api/tareas': {
            get: {
                tags: ['Catálogo'],
                summary: 'Listar tareas (admin)',
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Listado de tareas' } }
            }
        },
        '/api/tareas/create': {
            post: {
                tags: ['Catálogo'],
                summary: 'Crear tarea (admin)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/GenericEntity' }
                        }
                    }
                },
                responses: { 200: { description: 'Tarea creada' } }
            }
        },
        '/api/tareas/edit/{id}': {
            put: {
                tags: ['Catálogo'],
                summary: 'Editar tarea (admin)',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/GenericEntity' }
                        }
                    }
                },
                responses: { 200: { description: 'Tarea actualizada' } }
            }
        },
        '/api/tareas/delete/{id}': {
            delete: {
                tags: ['Catálogo'],
                summary: 'Eliminar tarea (admin)',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: { 200: { description: 'Tarea eliminada' } }
            }
        }
    }
};

const swaggerSpec = swaggerJSDoc({
    definition: swaggerDefinition,
    apis: []
});

export function setupSwagger(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
