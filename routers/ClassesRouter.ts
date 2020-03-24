import express from "express";
import { MysqlDatabase } from "../database/MysqlDatabase";
import { APIMiddleware } from "../common/APIMiddleware";
import { ClassesModel } from "../models/ClassesModel";
import { ClassesController } from "../controllers/classes/ClassesController";
import { ClassesResponseBuilder } from "../data/classes/ClassesResponseBuilder";

export class ClassesRouter {

    private readonly db: MysqlDatabase;
    private readonly router: express.Router;
    private readonly model: ClassesModel;
    private controller: ClassesController;

    constructor(database: MysqlDatabase) {
        this.db = database;
        this.router = express.Router();
        this.model = new ClassesModel(this.db);
        this.controller = new ClassesController(this.model);
    }

    public registerRoutes(): express.Router {
        this.signCreateRoute();

        return this.router;
    }

    private signCreateRoute() {
        this.router.post("/", APIMiddleware.isUserEmployee, (req: express.Request, res: express.Response) => {
            this.controller
                .create(req)
                .then((result: ClassesResponseBuilder) => {
                    return res
                        .status(result.httpStatus)
                        .send(result.buildResponse());
                });
        });
    }
}