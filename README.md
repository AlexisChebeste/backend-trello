# backend-trello

Workspace: Todos los miembros tienen los mismos permisos.

Esto simplifica el manejo de permisos porque no necesitamos diferenciar entre "admin" y "miembro" dentro del Workspace. Cualquier miembro puede:
Ver y editar los datos del workspace.
Enviar invitaciones a otros usuarios.
Ver, aceptar o rechazar invitaciones.
Ver la lista de miembros.
Board: Roles diferenciados (admin y miembro).

Aquí sí habrá una distinción clara entre "admin" y "miembro".
Los admins del board podrán:
Editar la configuración del board (nombre, color, descripción, etc.).
Agregar o quitar miembros del board.
Los miembros del board solo podrán interactuar con las listas y tarjetas, pero no con la configuración del board o sus miembros.
Las personas que sean miembro del board pero no del workspace:
Solo tienen acceso a los datos del board (no al workspace ni a otros boards del workspace).

Routes para Workspace
Base Path: /api/workspaces
Método	Ruta	Descripción
GET	/	Obtener la lista de todos los workspaces del usuario autenticado.
POST	/	Crear un nuevo workspace.
GET	/:workspaceId	Obtener los detalles de un workspace específico.
PATCH	/:workspaceId	Editar los detalles de un workspace (nombre, descripción, logo, etc.).
DELETE	/:workspaceId	Eliminar un workspace (requiere que no tenga miembros ni boards asociados).
GET	/:workspaceId/members	Obtener la lista de miembros del workspace.
DELETE	/:workspaceId/members/:userId	Eliminar a un miembro del workspace.
POST	/:workspaceId/invite	Enviar una invitación para unirse al workspace (requiere email).
GET	/:workspaceId/invitations	Obtener la lista de invitaciones pendientes en el workspace.
PATCH	/:workspaceId/invitations/:token	Aceptar o rechazar una invitación al workspace (basado en el token).
GET	/:workspaceId/boards	Obtener la lista de boards asociados al workspace.
POST	/:workspaceId/boards	Crear un nuevo board dentro del workspace.
DELETE	/:workspaceId/invitations/:token	Revocar una invitación pendiente.
GET	/:workspaceId/guests	Obtener la lista de invitados (usuarios con acceso a boards pero no al workspace completo).



Routes para Board
Base Path: /api/boards
Método	Ruta	Descripción
GET	/	Obtener la lista de boards donde el usuario tiene acceso (por workspace o invitación directa).
GET	/:boardId	Obtener los detalles de un board específico.
PATCH	/:boardId	Editar los detalles de un board (nombre, color, descripción, etc.).
DELETE	/:boardId	Eliminar un board (requiere ser admin del board).
GET	/:boardId/members	Obtener la lista de miembros del board.
PATCH	/:boardId/members/:userId	Cambiar el rol de un miembro del board (admin o member).
DELETE	/:boardId/members/:userId	Eliminar un miembro del board.
POST	/:boardId/invite	Enviar una invitación para unirse al board (requiere email).
GET	/:boardId/invitations	Obtener la lista de invitaciones pendientes en el board.
PATCH	/:boardId/invitations/:token	Aceptar o rechazar una invitación al board (basado en el token).
DELETE	/:boardId/invitations/:token	Revocar una invitación pendiente al board.
POST	/:boardId/lists	Crear una nueva lista dentro del board.
GET	/:boardId/lists	Obtener las listas asociadas a un board.
PATCH	/:boardId/lists/:listId	Editar los detalles de una lista específica.
DELETE	/:boardId/lists/:listId	Eliminar una lista de un board.
POST	/:boardId/lists/:listId/cards	Crear una nueva tarjeta dentro de una lista.
PATCH	/:boardId/lists/:listId/cards/:cardId	Editar los detalles de una tarjeta.
DELETE	/:boardId/lists/:listId/cards/:cardId	Eliminar una tarjeta de una lista.
