import type { BaseDBElement } from "./BaseDBElement";

export interface Product extends BaseDBElement {
  Name: string;
  Description: string;
  Price: number;
}
