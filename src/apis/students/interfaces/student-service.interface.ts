import { CreateStudentInput } from "../dto/create-student.input";
import { UpdateStudentInput } from "../dto/update-student.input";

export interface IStudentServiceCreate {
    createStudentInput: CreateStudentInput;
}

export interface IStudentServiceUpdate {
    updateStudentInput: UpdateStudentInput;
}

export interface IContext {
    req: Request & IStudentContext;
    res: Response;
}

export interface IStudentContext {
    student: {
        id: string;
    };
}