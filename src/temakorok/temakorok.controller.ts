import { Request, Response, Router, NextFunction } from "express";
import Controller from "../interfaces/controller.interface";
import temakorokModel from "./temakorok.model";
import HttpException from "../exceptions/HttpException";
import authMiddleware from "../middleware/auth.middleware";
import Itemakorok from "./temakorok.interface";
import CreatetemakorokDto from "./temakorok.dto";

export default class temakorokController implements Controller {
    public path = "/temakorok";
    public router = Router();
    private temakorokM = temakorokModel;

    constructor() {
        this.router.get(this.path, this.getAll);
        this.router.get(`${this.path}/:id`, authMiddleware, this.getById);
        this.router.post(this.path, authMiddleware, this.create);
        this.router.patch(`${this.path}/:id`, authMiddleware, this.modifyPATCH);
        this.router.put(`${this.path}/:id`, authMiddleware, this.modifyPUT);
        this.router.delete(`${this.path}/:id`, authMiddleware, this.delete);
    }

    private getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.temakorokM.find();
            res.send(data);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const document = await this.temakorokM.findById(id);
            if (document) {
                res.send(document);
            } else {
                res.status(404).send({ message: `Document with id ${id} not found!` });
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body: Itemakorok = req.body;
            const createdDocument = new this.temakorokM({
                ...body,
            });
            const savedDocument = await createdDocument.save();
            res.send(savedDocument);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private modifyPATCH = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const body: Itemakorok = req.body;
            const updatedDoc = await this.temakorokM.findByIdAndUpdate(id, body, { new: true, runValidators: true });
            if (updatedDoc) {
                res.send(updatedDoc);
            } else {
                res.status(404).send({ message: `Document with id ${id} not found!` });
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private modifyPUT = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const body = req.body;
            const modificationResult = await this.temakorokM.replaceOne({ _id: id }, body, { runValidators: true });
            if (modificationResult.modifiedCount) {
                const updatedDoc = await this.temakorokM.findById(id);
                res.send(updatedDoc);
            } else {
                res.status(404).send({ message: `Document with id ${id} not found!` });
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const successResponse = await this.temakorokM.findByIdAndDelete(id);
            if (successResponse) {
                res.sendStatus(200);
            } else {
                res.status(404).send({ message: `Document with id ${id} not found!` });
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };
}
