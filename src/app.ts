"use strict";

import { TodoApp } from "./server";

const server: TodoApp = new TodoApp(process.env.API_PORT || 3000);
// starting the server
server.startServer();
