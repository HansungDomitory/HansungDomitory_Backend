import { CreateStudentInput } from "../dto/create-student.input";
import { UpdateStudentInput } from "../dto/update-student.input";

export interface IStudentServiceCreate {
    createStudentInput: CreateStudentInput;
}

export interface IStudentServiceUpdate {
    updateStudentInput: UpdateStudentInput;
}
