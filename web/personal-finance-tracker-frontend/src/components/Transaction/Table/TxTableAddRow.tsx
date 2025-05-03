import React, { useEffect, useState } from 'react';
import { Transaction } from '../../../types/transaction';
import CategorySelector from '../../Category/CategorySelector';
import TagSelector from '../../Tag/TagSelector';
import {formatDateForInput, formatCurrency, parseCurrency} from "../../../services/helperClass";
import {isValidTransaction } from '../../../services/transactionService';


type Props = {
    onSave: (transaction: Transaction) => void;
    onCancel: () => void;
};

const TxTableAddRow: React.FC<Props> = ({onSave, onCancel }) => {
    const [rawNewAmount, setRawNewAmount] = useState<string | null>(null);
    const [newTransaction, setNewTransaction] = useState<Transaction>({
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        description: '',
      });

    const handleNewInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewTransaction(prev => ({
        ...prev,
        [name]: name === 'amount' ? parseCurrency(value) || 0 : value,
        }));
    };
        
    return (
        <tr>
            <td></td>
            <td>
                <input
                type="date"
                name="date"
                value={formatDateForInput(newTransaction.date)}
                onChange={handleNewInputChange}
                required
                />
            </td>
            <td>
                <input
                type="text"
                name="amount"
                value={rawNewAmount ?? formatCurrency(newTransaction.amount)}
                onFocus={() => setRawNewAmount(newTransaction.amount.toString())}
                onChange={e => {
                setRawNewAmount(e.target.value);
                const parsed = parseCurrency(e.target.value);
                setNewTransaction(prev => ({ ...prev, amount: parsed }));
                }}
                onBlur={() => setRawNewAmount(null)}
                />
            </td>
            <td>
                <input
                type="text"
                name="description"
                value={newTransaction.description}
                onChange={handleNewInputChange}
                />
            </td>
            <td>
                <CategorySelector
                    value={newTransaction.categoryId ?? null}
                    onChange={(id) => setNewTransaction(prev => ({ ...prev, categoryId: id }))}
                />
            </td>
            <td>
                <TagSelector
                value={newTransaction?.tags ?? []}
                onChange={(tags) =>
                    setNewTransaction(prev => {
                    if (!prev) return prev;
                    return { ...prev, tags};
                    })
                }
                />
            </td>
            <td colSpan={2}>
                <button onClick={() => onSave(newTransaction)}
                    disabled={!isValidTransaction(newTransaction)}
                > Save
                </button>
                <button onClick={onCancel}>Cancel</button>
            </td>
        </tr>
    );
};

export default TxTableAddRow;
