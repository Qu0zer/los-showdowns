/mi-proyecto
│
├── README.md                  # Documentación general del proyecto
├── docs/                      # Diagramas, especificaciones y documentación técnica
├── composer.json              # Gestión de dependencias con Composer
├── composer.lock              # Versión exacta de paquetes instalados
├── public/                    # Archivos accesibles públicamente
│   ├── index.php              # Punto de entrada (front controller)
│   ├── css/
│   ├── js/
│   └── images/
│
├── app/                       # Código fuente de la lógica de la aplicación
│   ├── config/                # Configuración de la app (DB, parámetros, etc.)
│   ├── models/                # Modelos (interacción con base de datos y lógica de datos)
│   ├── controllers/           # Controladores (gestión de las peticiones y lógica)
│   └── views/                 # Vistas (HTML, plantillas PHP)
│
└── vendor/                    # Dependencias instaladas con Composer