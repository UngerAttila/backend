import { config } from "dotenv";
import App from "./app";
import AuthenticationController from "./authentication/authentication.controller";
import UserController from "./user/user.controller";
import validateEnv from "./utils/validateEnv";
import kerdesekController from "./kerdesek/kerdesek.controller";
import temakorokController from "./temakorok/temakorok.controller";

config(); // Read and set variables from .env file.
validateEnv();

const app = new App([new AuthenticationController(), new UserController(), new kerdesekController(), new temakorokController()]);

app.listen();
