import type { BaseDBElement } from "./BaseDBElement";

export interface User extends BaseDBElement {
    Username: string,
    Email: string,
    FistName: string,
    LastName: string,
    Role: string[]
}