import React, { useEffect, useState } from 'react';
import { Transaction } from '../../../types/transaction';
import CategorySelector from '../../Category/CategorySelector';
import TagSelector from '../../Tag/TagSelector';
import {formatDateForInput, formatCurrency, parseCurrency} from "../../../services/helperClass";
import {isValidTransaction } from '../../../services/transactionService';
import { Category } from '../../../types/category';
import { Tag } from '../../../types/tag';


type Props = {
    index: number;
    transaction: Transaction;
    onSave: (transaction: Transaction) => void;
    onCancel: () => void;
    onCreateCategory?: (name: string) => Promise<Category>;
    initCategories?: Category[];
    onCreateTag?: (name: string) => Promise<Tag>;
    initTags?: Tag[];
};

const TxTableEditRow: React.FC<Props> = ({ 
    index, transaction, onSave, onCancel, 
    onCreateCategory, initCategories, onCreateTag, initTags
}) => {
    const txId: number | undefined = transaction.id;
    const [rawEditAmount, setRawEditAmount] = useState<string | null>(null);
    const [editTransaction, setEditTransaction] = useState<Transaction>(transaction);

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setEditTransaction(prev => {
            if (!prev) return prev;

            return {
            ...prev,
            [name]: name === 'amount' ? parseCurrency(value) || 0 : value,
            };
        });
    };

    if(!txId)
    {
        return (<><div>No Transaction Id</div></>)
    }
        
    return (
        <tr key={'edit-' + txId}>
            <td>{index}</td>
            <td>
                <input
                    type="date"
                    name="date"
                    value={formatDateForInput(editTransaction!.date)}
                    onChange={handleEditInputChange}
                />
            </td>
            <td>
                <input
                    type="text"
                    name="amount"
                    value={rawEditAmount ?? formatCurrency(editTransaction!.amount)}
                    onFocus={() => setRawEditAmount(editTransaction!.amount.toString())}
                    onChange={e => {
                        setRawEditAmount(e.target.value);
                        const parsed = parseCurrency(e.target.value);
                        setEditTransaction(prev => prev ? { ...prev, amount: parsed } : prev);
                    }}
                    onBlur={() => setRawEditAmount(null)}
                />
            </td>
            <td>
                <input
                    type="text"
                    name="description"
                    value={editTransaction!.description || ''}
                    onChange={handleEditInputChange}
                />
            </td>
            <td>
                <CategorySelector
                    value={editTransaction?.categoryId ?? null}
                    onChange={(id) =>
                        setEditTransaction(prev => {
                            if (!prev) return prev;
                            return { ...prev, categoryId: id };
                        })
                    }
                    {...(onCreateCategory && { onCreateCategory })} 
                    {...(initCategories && { initCategories })} 
                />
            </td>
            <td>
                <TagSelector
                    value={editTransaction?.tags ?? []}
                    onChange={(tags) =>
                        setEditTransaction(prev => {
                            if (!prev) return prev;
                            return { ...prev, tags};
                        })
                    }
                    {...(onCreateTag && { onCreateTag })} 
                    {...(initTags && { initTags })} 
                />
            </td>
            <td>
            <button
                onClick={() => onSave(editTransaction)}
                disabled={!isValidTransaction(editTransaction!)}
            >
                Save
            </button>
            <button onClick={onCancel}>Cancel</button>
            </td>
            <td></td>
        </tr>
    );
};

export default TxTableEditRow;
