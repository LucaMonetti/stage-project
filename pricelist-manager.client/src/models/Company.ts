import type { BaseDBElement } from "./BaseDBElement";
import type { User } from "./User";

export interface Company extends BaseDBElement {
    Name: string,
    Description: string,
    Employees: User[]
}