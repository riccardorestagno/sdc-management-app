import React, { useState, useEffect } from 'react';
import './condo-fees-admin-view-component.css';
import Months from '../../../enums/months';
import PayFrequencyType from '../../../enums/payFrequencyType';
import PaymentStatusType from '../../../enums/paymentStatusType';
import UnitNumbers from '../../../enums/unitNumbers';
import { getPayments, getOwnerInfoByUnitAddressId, getYears, updatePayment } from "../../../api";

const AdminCondoFees = ({ currentYear }) => {

    const currentMonthLabel = new Date().toLocaleString("default", { month: "long" });
    const currentMonth = Object.values(Months).find(month => month.label === currentMonthLabel);

    const [selectedMonth, setSelectedMonth] = useState(currentMonth.value);
    const [payFrequency, setPayFrequency] = useState(PayFrequencyType.MONTHLY.value);
    const [paymentStatus, setPaymentStatus] = useState(PaymentStatusType.PAID);

    const [year, setCurrentYear] = useState(currentYear); // Default to year in component input
    const [payments, setPayments] = useState([]);
    const [ownerInfo, setOwnerInfo] = useState([]);
    const [selectedUnitAddressId, setSelectedUnitAddressId] = useState('');
    const [years, setYears] = useState([]);
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

    useEffect(() => {
        const fetchOwnerInfo = async () => {
            try {
                const data = await getOwnerInfoByUnitAddressId(selectedUnitAddressId);
                setOwnerInfo(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchOwnerInfo();
    }, [selectedUnitAddressId]);

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

    const submitPaymentUpdate = async (selectedMonth, payFrequency, paymentStatus, selectedUnitAddressId) => {
        const paymentData = {
            "address": selectedUnitAddressId,
            "pay_frequency": payFrequency,
            "month": selectedMonth,
            "paid": paymentStatus == PaymentStatusType.PAID
        };
        await updatePayment(year, paymentData)
    };

    if (loading) return <p>Loading payments...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <div className="excel-container">
                <div className="excel-scrollable">
                    <table className="excel-table">
                        <thead>
                            <tr>
                                <th>
                                    <select value={year} onChange={(e) => setCurrentYear(e.target.value)}>
                                        {years.map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </th>
                                {Object.values(Months).map((month) => (
                                    <td key={month.value}>{month.label}</td>
                                ))}
                                <td key={PayFrequencyType.SPECIAL_CONTRIBUTION.value}>{PayFrequencyType.SPECIAL_CONTRIBUTION.label}</td>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment.address}>
                                    <td>
                                        <button onClick={() => setSelectedUnitAddressId(UnitNumbers[payment.address].value)}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                padding: 0,
                                                textAlign: "left",
                                                fontSize: "inherit",
                                                color: "inherit",
                                                width: "100%",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.transform = "scale(1.05)";
                                                e.target.style.color = "#007bff";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = "scale(1)";
                                                e.target.style.color = "inherit";
                                            }}
                                        >
                                            {UnitNumbers[payment.address].label}
                                        </button>
                                    </td>
                                    {Object.values(Months).map((month, index) => (
                                        <td key={month}
                                            className={payment.months_paid > index ? 'paid' : 'unpaid'}
                                        >
                                            ${(Math.round(payment.monthly_payment * 100) / 100).toFixed(2)}
                                        </td>
                                    ))}
                                    <td key={PayFrequencyType.SPECIAL_CONTRIBUTION.value}
                                        className={payment.special_contribution_paid ? 'paid' : 'unpaid'}
                                    >
                                        $450
                                    </td>
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
                        value={selectedUnitAddressId}
                        onChange={(e) => setSelectedUnitAddressId(e.target.value)}
                    >
                        <option value="">--Select Unit Number--</option>
                        {Object.values(UnitNumbers).map((unit) => (
                            <option key={unit.value} value={unit.value}>
                                {unit.label}
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
                        {Object.values(Months)
                            .filter((month) => {
                                if (payFrequency == PayFrequencyType.ANNUALLY.value) return month.value == 0;
                                if (payFrequency == PayFrequencyType.QUARTERLY.value) return [0, 3, 6, 9].includes(month.value);
                                if (payFrequency == PayFrequencyType.SPECIAL_CONTRIBUTION.value) return false;
                                return true; // Show all months by default
                            })
                            .map((month) => (
                                <option key={month.value} value={month.value} disabled={payFrequency == PayFrequencyType.ANNUALLY.value || payFrequency == PayFrequencyType.SPECIAL_CONTRIBUTION}>
                                    {month.label}
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
                        {Object.values(PayFrequencyType).map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
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



                <button onClick={() => {
                    submitPaymentUpdate(selectedMonth, payFrequency, paymentStatus, selectedUnitAddressId);
                    window.location.reload();
                }}>
                    Submit
                </button>
            </div>

            <div className="unit-info-container">
                <div>
                    <label htmlFor="column-select">Owner name: {ownerInfo.name}</label>
                </div>

                <div>
                    <label htmlFor="column-select">Owner email: {ownerInfo.email}</label>
                </div>

                <div>
                    <label htmlFor="column-select">Owner phone numer: {ownerInfo.number}</label>
                </div>

                <div>
                    <label htmlFor="column-select">Notes on file:</label>
                </div>
            </div>
        </div>

    );
};

export default AdminCondoFees;