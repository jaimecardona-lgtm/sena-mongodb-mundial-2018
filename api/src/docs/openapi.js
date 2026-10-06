const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'API RESTful Copa Mundial FIFA 2018',
    version: '1.0.0',
    description: 'AA2-EV01: Evidencia de API RESTful del programa SENA. Desarrollada con Node.js, Express y MongoDB/Mongoose. Integra datos de la Copa Mundial FIFA Rusia 2018 con operaciones CRUD completas.'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local de desarrollo'
    }
  ],
  tags: [
    {
      name: 'Health',
      description: 'Verificación de estado de la API'
    },
    {
      name: 'Equipos',
      description: 'Gestión de equipos de fútbol'
    },
    {
      name: 'Jugadores',
      description: 'Gestión de jugadores por equipo'
    },
    {
      name: 'Partidos',
      description: 'Gestión de partidos'
    }
  ],
  paths: {
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Verificar estado de la API',
        description: 'Endpoint de health check para confirmar que la API está operativa.',
        responses: {
          '200': {
            description: 'API operativa',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HealthResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/equipos': {
      get: {
        tags: ['Equipos'],
        summary: 'Listar todos los equipos',
        description: 'Retorna la lista completa de equipos, ordenada por id ascendente.',
        responses: {
          '200': {
            description: 'Lista de equipos',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success'
                    },
                    count: {
                      type: 'integer',
                      example: 2
                    },
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Equipo'
                      }
                    }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Error del servidor',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Equipos'],
        summary: 'Crear nuevo equipo',
        description: 'Crea un nuevo equipo en la base de datos. Requiere id, abbreviation, country y confederation únicos.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/EquipoInput'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Equipo creado correctamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success'
                    },
                    message: {
                      type: 'string',
                      example: 'Equipo creado correctamente'
                    },
                    data: {
                      $ref: '#/components/schemas/Equipo'
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Datos inválidos o incompletos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '409': {
            description: 'Conflicto de unicidad (id, abbreviation o country duplicados)',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/equipos/{id}': {
      get: {
        tags: ['Equipos'],
        summary: 'Obtener equipo por ID',
        description: 'Retorna un equipo específico por su id funcional.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID del equipo (entero positivo)',
            schema: {
              type: 'integer',
              example: 5
            }
          }
        ],
        responses: {
          '200': {
            description: 'Equipo encontrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success'
                    },
                    data: {
                      $ref: '#/components/schemas/Equipo'
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'ID inválido (no es un entero positivo)',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '404': {
            description: 'Equipo no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      },
      put: {
        tags: ['Equipos'],
        summary: 'Actualizar equipo',
        description: 'Actualiza los campos editables (abbreviation, country, confederation) de un equipo. El id es inmutable.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID del equipo a actualizar',
            schema: {
              type: 'integer',
              example: 5
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  abbreviation: {
                    type: 'string',
                    example: 'col'
                  },
                  country: {
                    type: 'string',
                    example: 'Colombia'
                  },
                  confederation: {
                    type: 'string',
                    example: 'CONMEBOL'
                  }
                },
                required: ['abbreviation', 'country', 'confederation']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Equipo actualizado correctamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success'
                    },
                    message: {
                      type: 'string',
                      example: 'Equipo actualizado correctamente'
                    },
                    data: {
                      $ref: '#/components/schemas/Equipo'
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'ID inválido o datos incompletos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '404': {
            description: 'Equipo no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '409': {
            description: 'Conflicto de unicidad (abbreviation o country duplicados)',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Equipos'],
        summary: 'Eliminar equipo',
        description: 'Elimina un equipo de la base de datos.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID del equipo a eliminar',
            schema: {
              type: 'integer',
              example: 5
            }
          }
        ],
        responses: {
          '200': {
            description: 'Equipo eliminado correctamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success'
                    },
                    message: {
                      type: 'string',
                      example: 'Equipo eliminado correctamente'
                    },
                    data: {
                      $ref: '#/components/schemas/Equipo'
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'ID inválido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '404': {
            description: 'Equipo no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/jugadores': {
      get: {
        tags: ['Jugadores'],
        summary: 'Listar jugadores con filtros opcionales',
        description: 'Retorna la lista de jugadores. Soporta filtros por equipo, número, posición y rango de estatura.',
        parameters: [
          {
            name: 'team',
            in: 'query',
            description: 'Filtrar por equipo (ej: Colombia)',
            schema: {
              type: 'string',
              example: 'Colombia'
            }
          },
          {
            name: 'numero',
            in: 'query',
            description: 'Filtrar por número de camiseta',
            schema: {
              type: 'integer',
              example: 1
            }
          },
          {
            name: 'posicion',
            in: 'query',
            description: 'Filtrar por posición (GK, DEF, MID, FWD)',
            schema: {
              type: 'string',
              example: 'GK'
            }
          },
          {
            name: 'estaturaMin',
            in: 'query',
            description: 'Altura mínima en cm',
            schema: {
              type: 'number',
              example: 180
            }
          },
          {
            name: 'estaturaMax',
            in: 'query',
            description: 'Altura máxima en cm',
            schema: {
              type: 'number',
              example: 190
            }
          }
        ],
        responses: {
          '200': {
            description: 'Lista de jugadores',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success'
                    },
                    count: {
                      type: 'integer',
                      example: 46
                    },
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Jugador'
                      }
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Parámetros de filtro inválidos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Jugadores'],
        summary: 'Crear nuevo jugador',
        description: 'Crea un nuevo jugador. El equipo debe existir en la colección de equipos. La combinación team+numero debe ser única.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/JugadorInput'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Jugador creado correctamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success'
                    },
                    message: {
                      type: 'string',
                      example: 'Jugador creado correctamente'
                    },
                    data: {
                      $ref: '#/components/schemas/Jugador'
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Datos inválidos o equipo no existe',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '409': {
            description: 'Conflicto: jugador con mismo team+numero ya existe',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/jugadores/{id}': {
      get: {
        tags: ['Jugadores'],
        summary: 'Obtener jugador por ID',
        description: 'Retorna un jugador específico por su MongoDB ObjectId.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'MongoDB ObjectId del jugador (24 caracteres hexadecimales)',
            schema: {
              type: 'string',
              example: '6ab9e8be727d291b5689f893'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Jugador encontrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success'
                    },
                    data: {
                      $ref: '#/components/schemas/Jugador'
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'ObjectId inválido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '404': {
            description: 'Jugador no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      },
      put: {
        tags: ['Jugadores'],
        summary: 'Actualizar jugador',
        description: 'Actualiza todos los campos de un jugador. Requiere reemplazo completo (PUT, no PATCH).',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'MongoDB ObjectId del jugador',
            schema: {
              type: 'string',
              example: '6ab9e8be727d291b5689f893'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/JugadorInput'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Jugador actualizado correctamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success'
                    },
                    message: {
                      type: 'string',
                      example: 'Jugador actualizado correctamente'
                    },
                    data: {
                      $ref: '#/components/schemas/Jugador'
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'ObjectId inválido o datos incompletos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '404': {
            description: 'Jugador no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '409': {
            description: 'Conflicto: otro jugador tiene mismo team+numero',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Jugadores'],
        summary: 'Eliminar jugador',
        description: 'Elimina un jugador de la base de datos.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'MongoDB ObjectId del jugador',
            schema: {
              type: 'string',
              example: '6ab9e8be727d291b5689f893'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Jugador eliminado correctamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success'
                    },
                    message: {
                      type: 'string',
                      example: 'Jugador eliminado correctamente'
                    },
                    data: {
                      $ref: '#/components/schemas/Jugador'
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'ObjectId inválido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '404': {
            description: 'Jugador no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/partidos': {
      get: {
        tags: ['Partidos'],
        summary: 'Listar partidos con filtros opcionales',
        description: 'Retorna la lista de partidos. Soporta filtros por equipo y fecha (DD/MM/YY).',
        parameters: [
          {
            name: 'equipo',
            in: 'query',
            description: 'Filtrar por equipo (busca en equipo1 o equipo2)',
            schema: {
              type: 'string',
              example: 'Colombia'
            }
          },
          {
            name: 'fecha',
            in: 'query',
            description: 'Filtrar por fecha exacta',
            schema: {
              type: 'string',
              pattern: '\\d{2}/\\d{2}/\\d{2}',
              example: '11/07/18'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Lista de partidos',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success'
                    },
                    count: {
                      type: 'integer',
                      example: 2
                    },
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Partido'
                      }
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Formato de fecha inválido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Partidos'],
        summary: 'Crear nuevo partido',
        description: 'Crea un nuevo partido. Valida que equipo1 y equipo2 sean diferentes, que la fecha sea DD/MM/YY, que la hora tenga formato SENA, y que no exista duplicado (considerando equipos en orden inverso).',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PartidoInput'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Partido creado correctamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success'
                    },
                    message: {
                      type: 'string',
                      example: 'Partido creado correctamente'
                    },
                    data: {
                      $ref: '#/components/schemas/Partido'
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Datos inválidos (equipos iguales, fecha/hora incorrecta, campos incompletos)',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '409': {
            description: 'Partido duplicado (mismo equipo, fecha y hora)',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/partidos/{id}': {
      get: {
        tags: ['Partidos'],
        summary: 'Obtener partido por ID',
        description: 'Retorna un partido específico por su MongoDB ObjectId.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'MongoDB ObjectId del partido (24 caracteres hexadecimales)',
            schema: {
              type: 'string',
              example: '6ab9e8bf727d291b5689f8c1'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Partido encontrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success'
                    },
                    data: {
                      $ref: '#/components/schemas/Partido'
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'ObjectId inválido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '404': {
            description: 'Partido no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      },
      put: {
        tags: ['Partidos'],
        summary: 'Actualizar partido',
        description: 'Actualiza todos los campos de un partido. Valida que equipos sean diferentes y que fecha/hora sean válidas.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'MongoDB ObjectId del partido',
            schema: {
              type: 'string',
              example: '6ab9e8bf727d291b5689f8c1'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PartidoInput'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Partido actualizado correctamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success'
                    },
                    message: {
                      type: 'string',
                      example: 'Partido actualizado correctamente'
                    },
                    data: {
                      $ref: '#/components/schemas/Partido'
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'ObjectId inválido o datos incompletos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '404': {
            description: 'Partido no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '409': {
            description: 'Partido duplicado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Partidos'],
        summary: 'Eliminar partido',
        description: 'Elimina un partido de la base de datos.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'MongoDB ObjectId del partido',
            schema: {
              type: 'string',
              example: '6ab9e8bf727d291b5689f8c1'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Partido eliminado correctamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success'
                    },
                    message: {
                      type: 'string',
                      example: 'Partido eliminado correctamente'
                    },
                    data: {
                      $ref: '#/components/schemas/Partido'
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'ObjectId inválido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '404': {
            description: 'Partido no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      HealthResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'ok'
          },
          service: {
            type: 'string',
            example: 'sena-mundial-2018-api'
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'error'
          },
          message: {
            type: 'string',
            example: 'Descripción del error'
          }
        }
      },
      Equipo: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'MongoDB ObjectId',
            example: '507f1f77bcf86cd799439011'
          },
          id: {
            type: 'integer',
            example: 5
          },
          abbreviation: {
            type: 'string',
            example: 'col'
          },
          country: {
            type: 'string',
            example: 'Colombia'
          },
          confederation: {
            type: 'string',
            example: 'CONMEBOL'
          }
        }
      },
      EquipoInput: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 5
          },
          abbreviation: {
            type: 'string',
            example: 'col'
          },
          country: {
            type: 'string',
            example: 'Colombia'
          },
          confederation: {
            type: 'string',
            example: 'CONMEBOL'
          }
        },
        required: ['id', 'abbreviation', 'country', 'confederation']
      },
      Jugador: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'MongoDB ObjectId',
            example: '6ab9e8be727d291b5689f893'
          },
          team: {
            type: 'string',
            example: 'Colombia'
          },
          numero: {
            type: 'integer',
            example: 1
          },
          posicion: {
            type: 'string',
            example: 'GK'
          },
          nombre: {
            type: 'string',
            example: 'OSPINA David'
          },
          fechaNacimiento: {
            type: 'string',
            example: '31.08.1988'
          },
          nombreCamiseta: {
            type: 'string',
            example: 'OSPINA'
          },
          club: {
            type: 'string',
            example: 'Arsenal FC (ENG)'
          },
          estatura: {
            type: 'integer',
            example: 183
          },
          peso: {
            type: 'integer',
            example: 80
          }
        }
      },
      JugadorInput: {
        type: 'object',
        properties: {
          team: {
            type: 'string',
            example: 'Colombia'
          },
          numero: {
            type: 'integer',
            example: 1
          },
          posicion: {
            type: 'string',
            example: 'GK'
          },
          nombre: {
            type: 'string',
            example: 'OSPINA David'
          },
          fechaNacimiento: {
            type: 'string',
            example: '31.08.1988'
          },
          nombreCamiseta: {
            type: 'string',
            example: 'OSPINA'
          },
          club: {
            type: 'string',
            example: 'Arsenal FC (ENG)'
          },
          estatura: {
            type: 'integer',
            example: 183
          },
          peso: {
            type: 'integer',
            example: 80
          }
        },
        required: ['team', 'numero', 'posicion', 'nombre', 'fechaNacimiento', 'nombreCamiseta', 'club', 'estatura', 'peso']
      },
      Partido: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'MongoDB ObjectId',
            example: '6ab9e8bf727d291b5689f8c1'
          },
          equipo1: {
            type: 'string',
            example: 'Colombia'
          },
          equipo2: {
            type: 'string',
            example: 'Japan'
          },
          fecha: {
            type: 'string',
            example: '11/07/18'
          },
          hora: {
            type: 'string',
            example: '12:00:00 p. m.'
          }
        }
      },
      PartidoInput: {
        type: 'object',
        properties: {
          equipo1: {
            type: 'string',
            example: 'Colombia'
          },
          equipo2: {
            type: 'string',
            example: 'Japan'
          },
          fecha: {
            type: 'string',
            example: '11/07/18'
          },
          hora: {
            type: 'string',
            example: '12:00:00 p. m.'
          }
        },
        required: ['equipo1', 'equipo2', 'fecha', 'hora']
      }
    }
  }
};

export { openapi };
