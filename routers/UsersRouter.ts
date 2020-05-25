import express from "express";
import { UsersController } from "../controllers/users/UsersController";
import { UsersResponseBuilder } from "../data/users/UsersResponseBuilder";
import { IRoutable } from "./IRoutable";

export class UsersRouter implements IRoutable {

    private readonly router: express.Router;
    private readonly controller: UsersController;

    constructor(controller: UsersController) {
        this.router = express.Router();
        this.controller = controller;
    }

    public registerRoutes(): express.Router {
        this.signLoginRoute();
        this.signRegisterRoute();

        return this.router;
    }

    private signLoginRoute() {
        this.router.post("/login", (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.controller
                .login(req.body)
                .then((result: UsersResponseBuilder) => {
                    const authToken = result.authToken || "";

                    if (authToken) {
                        res.header("auth-token", authToken);
                    }

                    return res
                        .status(result.httpStatus)
                        .send(result.buildResponse());
                })
                .catch(next);
        });
    }

    // TODO: This method should not be used by "everyone".
    // Currently is accessible for everyone for development purposes.
    private signRegisterRoute() {
        this.router.post("/register", (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.controller
                .register(req.body)
                .then((result: UsersResponseBuilder) => {
                    return res
                        .status(result.httpStatus)
                        .send(result.buildResponse());
                })
                .catch(next);
        });
    }
}
