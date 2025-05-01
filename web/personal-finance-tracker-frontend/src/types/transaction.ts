import { Category } from "../types/category";

import { Tag } from "../types/tag";

export type Transaction = {
    id?: number;
    amount: number;
    date: string; // ISO date string
    description?: string;
    categoryId?: number | null
    category?: Category | null;
    tags?: Tag[];
  };

  