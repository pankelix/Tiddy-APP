# House organization App

## Intro

An app to help with the organization of the house chores

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjk5ZXEzejNiam91aDd0N3g4YXdkYjNodHcwOWllaXhxMTk2dXRidCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/NV4cSrRYXXwfUcYnua/giphy.gif)

Create a Home group, with several users that live inside the same house

Different profiles with different permissions (admin/user/home/child)

## Functional Description

### Use Cases

* Manage user
    - Create homes
* Manage homes
    - Add other users
* Manage users in a home
    - Manage children
    - Manage user permissions
* Manage tasks
    - See and filter tasks
    - Create new tasks and assign them on different users
    - Mark different tasks as completed or delayed
<!-- Cosas que el usuario podrá hacer en la aplicación (cosas que aporten valor, cosas tipo Login, Register... sobran)
* search socks
* add socks to cart
* view cart
* add / remove items
* checkout cart
* view orders
* view order status
* ...
* ... -->

### Views

#### 1 User registration
* User creation
    - Name
    - Picture
    - Email & password

#### 2 Homes management
* Home creation
    - Name
    - Rooms
* Add users by id (first version)
    - Assign a color (unique, random)
    - Assign a role

#### 3 Users Management
* User edition
    - Add more users by id (first version)
    - Delete users
    - Edit users
        - Change assignation color
        - Change role

#### 4 Home
* Tasks feed
    - Default: Calendar since actual day (vertical infinite scroll)
    - Filter
        - Date range
        - Room
        - Assigned person
        - Status (proposal vs official)
    - Propose task (+)
        - Create new task (goto 6 task creation)
        - Change task status
        - Assign task (optional)
    - Click on task (goto 5 task details)

#### 5 Task details

* Reacting to proposed task (modal)
    - Assign this task
        - To self (user), to another users (admin)
    - Complete this task
        - Completion date (today by default)
        - If it's a periodic task, it renovates automatically
        - Points assignation
        - If completed from HOME DEVICE, choose child
    - Aplazar tarea (contador de aplazamientos)
    - Editar esta tarea (admin)
    - Eliminar esta tarea (admin)

#### 6 Task creation

* ???
    - Crear tarea proposal
        - Nombre de la tarea
        - Temporalidad: puntual, diaria, semanal (cada miércoles), mensual (cada día 23) o elegir (cada x días)
        - Habitación a la que pertenece (de base en la que estás)
        - Puntos que vale completarla (opcional)
    - Editar tarea
    - Archivar tarea
    - Eliminar tarea

* Notificaciones push diarias: (version 1)
    - Tareas de hoy asignadas
    - Tareas de hoy aun libres

##### Vista 4 Lista de la compra (version 2)

* Ver distintas listas creadas

* Crear nueva lista (+)
    - Lista en blanco / Elegir entre las plantillas
    - Todos los usuarios pueden añadir a estas listas
    - Asignar a una tarea (opcional)

* En la lista
    - Guardar como plantilla
    - Activar modo comprar
        - Ya no se puede añadir nada
        - Aparece el modo check y el modo "no encontrado"
        - Los objetos que no se han encontrado pasan directamente a la siguiente lista
        - Lógica para el orden en que se hace check (las próximas veces se propondrá este orden para facilitar la compra)
        - Opción de finalizar, donde se puede añadir el ticket

## A futuro (proximas versiones):

* Compatibilidad con asistentes como Siri, Google assistant o Alexa
* Cada habitación que tenga un % de limpieza, según las tareas por hacer vs las tareas hechas (version 0?)
* Foto a tarea completada

* Transformador de foto de ticket en ticket digital de texto para ahorro de datos y para manejar "presupuestos" (version 3)

* Notificaciones push con recordatorios (version 1)
* Listas de la compra lógicas (version 1)
* Invitación sencilla (version 1)
* Crear código de invitación admin/user/hogar (botón rápido de copia) (version 1)

##### Vista nueva: puntuación (opcional) (version 0)

* Ranking de puntos
* Estadísticas
* Crear premios

##### Vista nueva: citas

* Citas (médico tal dia para user1, cena tal otro dia para users 1 y 2)
* Sugerencias de tareas prehechas según la cita (por ejemplo si hay cena en casa, recoger salón / limpiar cocina / hacer compra)
* Opción de adjuntar tickets

* Notificaciones push diarias:
    - citas de hoy

## Technical Description

### Data Model

User
* id (string)
* name (string)
* email (string)
* password (string)

Task
* id (string)
* name (string)
* periodical (string)
* done (boolean)
* points?? (number)
* Comments

Shopping list
* id (string)
* items (array)

...

<!-- Sock
* id (string)
* name (string)
* size (string)
* theme (string)
* brand (string)
* price (number)

Cart
* id (string)
* user (user.id)
* items ([socks.id])

Order
* id (string)
* date (Date
* items ([socks.id])) -->
