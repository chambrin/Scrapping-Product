import { Elysia } from "elysia";
import chalk from "chalk";
import {Ekosport} from "./services/ekosport";

const app = new Elysia().get("/", () => "Hello Elysia").listen(4000);

console.log(
    `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

console.log(chalk.blue("Start programme"));

const Service = () => {
    Ekosport();
}

Service();