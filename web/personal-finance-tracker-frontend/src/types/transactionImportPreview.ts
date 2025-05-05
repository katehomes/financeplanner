import { PreviewTransaction } from "../hooks/useImportTable";
import { Category } from "./category";


export type TransactionImportPreview = {
    rows: PreviewTransaction[];
    importedCategories: Category[];
  };