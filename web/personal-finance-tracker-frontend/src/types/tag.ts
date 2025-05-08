import { Transaction } from "./transaction";

export type Tag = {
    id?: number;
    name: string;
    color?: string;
    border?: string;
    text?: string;
    transactions?: Transaction[];
};
