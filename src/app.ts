"use strict";

import { Hasura } from "./server";

const server: Hasura = new Hasura(process.env.API_PORT || 3000);
// starting the server
server.startServer();
