import { Elysia } from "elysia";
import chalk from "chalk";
import {startServices} from "./bin/Starter";

const backend = new Elysia().get("/", () => "Hello Elysia").listen(4000);

console.log(
    `🦊 Elysia is running at http://${backend.server?.hostname}:${backend.server?.port}`
);

console.log(chalk.blue("Start programme"));

// Selector service CLI
startServices();