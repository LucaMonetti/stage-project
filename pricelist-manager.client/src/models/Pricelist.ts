import type { BaseDBElement } from "./BaseDBElement";
import type { Product } from "./Product";

export interface Pricelist extends BaseDBElement {
    Name: string,
    Description: string,
    ElementsCount: number,
    Products: Product[],
}