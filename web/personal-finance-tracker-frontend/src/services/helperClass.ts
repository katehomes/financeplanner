export const formatDateForInput = (dateStr: string) => {
    return new Date(dateStr).toISOString().split('T')[0];
  };

export const formatCurrency = (value: number) =>
    value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    });
  
export const parseCurrency = (value: string): number => {
    const numeric = value.replace(/[^0-9.-]+/g, ''); // Remove $ and commas
    return parseFloat(numeric) || 0;
};