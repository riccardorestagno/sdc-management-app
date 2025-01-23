import React, { useState, useEffect } from 'react';
import './condo-fees-admin-view-component.css';
import Months from '../../../enums/months';
import PayFrequencyType from '../../../enums/payFrequencyType';
import PaymentStatusType from '../../../enums/paymentStatusType';
import UnitNumbers from '../../../enums/unitNumbers';
import { getPayments } from "../../../api";

const AdminCondoFees = ({ year }) => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                setLoading(true);
                const data = await getPayments(year);
                setPayments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [year]);

    const currentMonth = new Date().toLocaleString("default", { month: "long" });

    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [payFrequency, setPayFrequency] = useState(PayFrequencyType.MONTHLY);
    const [paymentStatus, setPaymentStatus] = useState(PaymentStatusType.PAID);
    const [selectedUnit, setSelectedUnit] = useState('');

    if (loading) return <p>Loading payments...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <div className="excel-container">
                <div className="excel-scrollable">
                    <table className="excel-table">
                        <thead>
                            <tr>
                                <th>2025</th>
                                {Object.values(Months).map((month) => (
                                    <td key={month}>{month}</td>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment.address}>
                                    <td>{UnitNumbers[payment.address]}</td>
                                    {Object.values(Months).map((month, index) => (
                                        <td key={month}
                                            className={payment.months_paid > index ? 'paid' : 'unpaid'}
                                        >
                                            ${(Math.round(payment.monthly_payment * 100) / 100).toFixed(2)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="widget">
                <div>
                    <label htmlFor="name-select">Unit Number:</label>
                    <select
                        id="name-select"
                        value={selectedUnit}
                        onChange={(e) => setSelectedUnit(e.target.value)}
                    >
                        <option value="">--Select Unit Number--</option>
                        {Object.values(UnitNumbers).map((unit) => (
                            <option key={unit} value={unit}>
                                {unit}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="column-select">Month:</label>
                    <select
                        id="column-select"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        {Object.values(Months).map((tab) => (
                            <option key={tab} value={tab}>
                                {tab}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="row-select">Pay Frequency:</label>
                    <select
                        id="row-select"
                        value={payFrequency}
                        onChange={(e) => setPayFrequency(e.target.value)}
                    >
                        {Object.values(PayFrequencyType).map((tab) => (
                            <option key={tab} value={tab}>
                                {tab}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="row-select">Payment Status:</label>
                    <select
                        id="row-select"
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                    >
                        {Object.values(PaymentStatusType).map((tab) => (
                            <option key={tab} value={tab}>
                                {tab}
                            </option>
                        ))}
                    </select>
                </div>



                <button onClick={() => console.log(selectedMonth, payFrequency, paymentStatus, selectedUnit)}>
                    Submit
                </button>
            </div>

            <div className="unit-info-container">
                <div>
                    <label htmlFor="column-select">Owner name: 'data here'</label>
                </div>

                <div>
                    <label htmlFor="column-select">Owner email: 'data here'</label>
                </div>

                <div>
                    <label htmlFor="column-select">Owner phone numer: 'data here'</label>
                </div>

                <div>
                    <label htmlFor="column-select">Notes on file:</label>
                </div>
            </div>
        </div>

    );
};

export default AdminCondoFees;