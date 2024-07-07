import { CreateStudentInput } from "../dto/create-student.input";
import { UpdateStudentInput } from "../dto/update-student.input";
import { Request, Response } from 'express';

export interface IStudentServiceCreate {
    createStudentInput: CreateStudentInput;
}

export interface IStudentServiceUpdate {
    updateStudentInput: UpdateStudentInput;
}

export interface IContext {
    req: Request;
    res: Response;
}

export interface IStudentContext {
    student: {
        id: string;
    };
}

export interface RequestWithStudent extends Request {
    user: {
        id: string;
    };
}