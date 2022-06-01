import { Request, Response, Router, NextFunction } from "express";
import Controller from "../interfaces/controller.interface";
import Ikerdesek from "./kerdesek.interface";
import kerdesekModel from "./kerdesek.model";
import HttpException from "../exceptions/HttpException";
import authMiddleware from "../middleware/auth.middleware";
import validationMiddleware from "../middleware/validation.middleware";
import CreatekerdesekDto from "./kerdesek.dto";

export default class kerdesekController implements Controller {
    public path = "/api/kerdesek";
    public router = Router();
    private kerdesekM = kerdesekModel;

    constructor() {
        this.router.get(this.path, this.getAll);
        this.router.get(`${this.path}/:id`, authMiddleware, this.getById);
        this.router.get(`${this.path}/:offset/:limit/:order/:sort/:keyword?`, authMiddleware, this.getPaginatedkerdesek);
        this.router.post(this.path, [authMiddleware, validationMiddleware(CreatekerdesekDto, false)], this.create);
        this.router.patch(`${this.path}/:id`, authMiddleware, this.modifyPATCH);
        this.router.put(`${this.path}/:id`, authMiddleware, this.modifyPUT);
        this.router.delete(`${this.path}/:id`, authMiddleware, this.delete);
    }

    private getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.kerdesekM.find().populate("temakor", "-_id");
            res.send(data);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const document = await this.kerdesekM.findById(id);
            if (document) {
                res.send(document);
            } else {
                res.status(404).send({ message: `Document with id ${id} not found!` });
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private getPaginatedkerdesek = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const offset = parseInt(req.params.offset);
            const limit = parseInt(req.params.limit);
            const order = req.params.order;
            const sort = parseInt(req.params.sort); // desc: -1  asc: 1
            let kerdesek = [];
            let count = 0;
            if (req.params.keyword) {
                const regex = new RegExp(req.params.keyword, "i"); // i for case insensitive
                count = await this.kerdesekM.find({ $or: [{ kerdes: { $regex: regex } }, { hazszam: { $regex: regex } }] }).count();
                kerdesek = await this.kerdesekM
                    .find({ $or: [{ kerdes: { $regex: regex } }, { hazszam: { $regex: regex } }] })
                    .populate("temakor", "-_id")
                    .sort(`${sort == -1 ? "-" : ""}${order}`)
                    .skip(offset)
                    .limit(limit);
            } else {
                count = await this.kerdesekM.countDocuments();
                kerdesek = await this.kerdesekM
                    .find({})
                    .populate("temakor", "-_id")
                    .sort(`${sort == -1 ? "-" : ""}${order}`)
                    .skip(offset)
                    .limit(limit);
            }
            res.send({ count: count, kerdesek: kerdesek });
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body: Ikerdesek = req.body;
            const createdDocument = new this.kerdesekM({
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
            const body: Ikerdesek = req.body;
            const updatedDoc = await this.kerdesekM.findByIdAndUpdate(id, body, { new: true, runValidators: true });
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
            const modificationResult = await this.kerdesekM.replaceOne({ _id: id }, body, { runValidators: true });
            if (modificationResult.modifiedCount) {
                const updatedDoc = await this.kerdesekM.findById(id).populate("temakor", "-_id");
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
            const successResponse = await this.kerdesekM.findByIdAndDelete(id);
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
