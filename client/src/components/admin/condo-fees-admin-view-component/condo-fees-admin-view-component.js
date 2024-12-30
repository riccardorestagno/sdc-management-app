import React, { useState } from 'react';
import './condo-fees-admin-view-component.css';
import Months from '../../../enums/months';
import PayFrequencyType from '../../../enums/payFrequencyType';
import PaymentStatusType from '../../../enums/paymentStatusType';

const AdminCondoFees = () => {
    const [data, setData] = useState({
        John: {
            January: { amount: 100, paid: false },
            February: { amount: 150, paid: false },
            March: { amount: 200, paid: false },
            April: { amount: 110, paid: false },
            May: { amount: 130, paid: false },
            June: { amount: 140, paid: false },
            July: { amount: 120, paid: false },
            August: { amount: 150, paid: false },
            September: { amount: 160.45, paid: false },
            October: { amount: 170, paid: false },
            November: { amount: 180, paid: false },
            December: { amount: 190, paid: false },
        },
        Jane: {
            January: { amount: 120, paid: false },
            February: { amount: 180, paid: false },
            March: { amount: 250, paid: false },
            April: { amount: 130, paid: false },
            May: { amount: 150, paid: false },
            June: { amount: 160, paid: false },
            July: { amount: 140, paid: false },
            August: { amount: 170, paid: false },
            September: { amount: 180, paid: false },
            October: { amount: 190, paid: false },
            November: { amount: 200, paid: false },
            December: { amount: 210, paid: false },
        },
        Alice: {
            January: { amount: 130, paid: false },
            February: { amount: 170, paid: false },
            March: { amount: 220, paid: false },
            April: { amount: 140, paid: false },
            May: { amount: 160, paid: false },
            June: { amount: 170, paid: false },
            July: { amount: 150, paid: false },
            August: { amount: 180, paid: false },
            September: { amount: 190, paid: false },
            October: { amount: 200, paid: false },
            November: { amount: 210, paid: false },
            December: { amount: 220, paid: false },
        },
    });

    const currentMonth = new Date().toLocaleString("default", { month: "long" });

    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [payFrequency, setPayFrequency] = useState(PayFrequencyType.MONTHLY);
    const [paymentStatus, setPaymentStatus] = useState(PaymentStatusType.PAID);
    const [selectedName, setSelectedName] = useState('');

    const names = Object.keys(data);

    return (
        <div>
            <div className="excel-container">
                <div className="excel-scrollable">
                    <table className="excel-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                {Object.values(Months).map((month) => (
                                    <td key={month}>{month}</td>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {names.map((name) => (
                                <tr key={name}>
                                    <td>{name}</td>
                                    {Object.values(Months).map((month) => (
                                        <td key={month}
                                            className={data[name][month].paid ? 'paid' : 'unpaid'}
                                        >
                                            ${data[name][month].amount}
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

                <div>
                    <label htmlFor="name-select">Co-Owner:</label>
                    <select
                        id="name-select"
                        value={selectedName}
                        onChange={(e) => setSelectedName(e.target.value)}
                    >
                        <option value="">--Select Co-Owner--</option>
                        {names.map((name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>

                <button onClick={() => console.log(selectedMonth, payFrequency, paymentStatus, selectedName)}>
                    Submit
                </button>
            </div>
        </div>

    );
};

export default AdminCondoFees;