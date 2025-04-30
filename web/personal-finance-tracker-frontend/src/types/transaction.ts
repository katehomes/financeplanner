export type Transaction = {
    id?: number;
    amount: number;
    date: string; // ISO date string
    description?: string;
  };

export type NewTransaction = Omit<Transaction, 'id'>;

  