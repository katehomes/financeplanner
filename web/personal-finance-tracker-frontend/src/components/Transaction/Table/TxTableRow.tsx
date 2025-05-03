import React from 'react';
import { Transaction } from '../../../types/transaction';
import { Tag } from '../../../types/tag';
import TagChipList from '../../Tag/TagChipList';
import {formatCurrency} from "../../../services/helperClass";

type Props = {
    index: number;
  transaction: Transaction;
  isSelected: boolean;
  onSelect: (id: number, checked: boolean) => void;
  onEdit: () => void;
};

const TxTableRow: React.FC<Props> = ({ index, transaction, isSelected, onSelect, onEdit }) => {
    const txId: number | undefined = transaction.id;
    if(!txId)
    {
        return (<><div>No Transaction Id</div></>)
    }
        
    return (
        <tr className="transaction-row">
            <td>{index}</td>
            <td>{new Date(transaction.date).toLocaleDateString()}</td>
            <td>{formatCurrency(transaction.amount)}</td>
            <td>{transaction.description || '-'}</td>
            <td>{transaction.category?.name || 'Uncategorized'}</td>
            <td>
                <TagChipList tags={transaction.tags as Tag[]} />
            </td>
            <td>
                <button onClick={onEdit}>Edit</button>
            </td>
            
            <td>
                <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelect(txId, e.target.checked)}
                />
            </td>
        </tr>
    );
};

export default TxTableRow;
