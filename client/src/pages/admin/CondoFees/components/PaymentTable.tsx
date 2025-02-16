import React, { useEffect, useState } from 'react';
import NewFiscalYear from './NewFiscalYear';
import Months from '../../../../enums/months';
import PayFrequencyType from '../../../../enums/payFrequencyType';
import UnitNumbers from '../../../../enums/unitNumbers';
import { getFiscalYear, getPayments, getYears } from '../../../../services/api';

interface PaymentTableProps {
    selectedYear: number;
    setSelectedYear: (year: number) => void;
    setSelectedUnitAddressId: (id: string) => void;
}

const PaymentTable: React.FC<PaymentTableProps> = ({
    selectedYear,
    setSelectedYear,
    setSelectedUnitAddressId,
}) => {

    const [specialContributionAmount, setSpecialContributionAmount] = useState(0);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    let [years, setYears] = useState([]);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                setLoading(true);
                const paymentsData = await getPayments(selectedYear);
                const specialContributionAmount = (await getFiscalYear(selectedYear)).special_contribution_amount;
                setPayments(paymentsData);
                setSpecialContributionAmount(specialContributionAmount);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [selectedYear]);

    useEffect(() => {
        const fetchYears = async () => {
            try {
                setLoading(true);
                const data = await getYears();
                setYears(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchYears();
    }, []);

    const nextYear = new Date().getFullYear() + 1;
    if (!years.includes(nextYear)) {
        years = [nextYear, ...years];
    }

    if (loading) return <p>Loading payments...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="excel-container">
            <div className="excel-scrollable">
                <table className="excel-table">
                    <thead>
                        <tr>
                            <th>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                >
                                    {years.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                                {nextYear === selectedYear && (
                                    <NewFiscalYear exists={payments.length !== 0} year={selectedYear} />
                                )}
                            </th>
                            {Object.values(Months).map((month) => (
                                <td key={month.value}>{month.label}</td>
                            ))}
                            <td key={PayFrequencyType.SPECIAL_CONTRIBUTION.value}>
                                {PayFrequencyType.SPECIAL_CONTRIBUTION.label}
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment.address}>
                                <td>
                                    <button
                                        onClick={() => setSelectedUnitAddressId(String(UnitNumbers[payment.address].value))}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: 0,
                                            textAlign: 'left',
                                            fontSize: 'inherit',
                                            color: 'inherit',
                                            width: '100%',
                                        }}
                                        onMouseEnter={(e) => {
                                            const target = e.target as HTMLElement;
                                            target.style.transform = 'scale(1.05)';
                                            target.style.color = '#007bff';
                                        }}
                                        onMouseLeave={(e) => {
                                            const target = e.target as HTMLElement;
                                            target.style.transform = 'scale(1)';
                                            target.style.color = 'inherit';
                                        }}
                                    >
                                        {UnitNumbers[payment.address].label}
                                    </button>
                                </td>
                                {Object.values(Months).map((month, index) => (
                                    <td key={month.value} className={payment.months_paid > index ? 'paid' : 'unpaid'}>
                                        ${(Math.round(payment.monthly_payment * 100) / 100).toFixed(2)}
                                    </td>
                                ))}
                                <td
                                    key={PayFrequencyType.SPECIAL_CONTRIBUTION.value}
                                    className={payment.special_contribution_paid ? 'paid' : 'unpaid'}
                                >
                                    ${(Math.round(specialContributionAmount * 100) / 100).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentTable;