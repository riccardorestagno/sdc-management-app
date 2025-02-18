import React, { useState } from 'react';
import { EnumOption } from '../../../../enums/enumOption';
import PayFrequencyType from '../../../../enums/payFrequencyType';
import UnitNumbers from '../../../../enums/unitNumbers';
import Months from '../../../../enums/months';
import PaymentStatusType from '../../../../enums/paymentStatusType';
import { updatePayment } from '../../../../services/api';

interface PaymentUpdateProps {
    selectedYear: number;
    selectedUnitAddressId: string;
    setSelectedUnitAddressId: React.Dispatch<React.SetStateAction<string>>;
}

const PaymentUpdate: React.FC<PaymentUpdateProps> = ({ selectedYear, selectedUnitAddressId, setSelectedUnitAddressId }) => {
    const currentMonthLabel = new Date().toLocaleString("default", { month: "long" });
    const currentMonth = Object.values(Months).find(month => month.label === currentMonthLabel);

    const [selectedMonth, setSelectedMonth] = useState<number>(Number(currentMonth.value));
    const [payFrequency, setPayFrequency] = useState<number>(Number(PayFrequencyType.MONTHLY.value));
    const [paymentStatus, setPaymentStatus] = useState<string>(PaymentStatusType.PAID);

    const submitPaymentUpdate = async (selectedMonth: number, payFrequency: number, paymentStatus: string, selectedUnitAddressId: string) => {
        const paymentData = {
            "address": selectedUnitAddressId,
            "pay_frequency": payFrequency,
            "month": selectedMonth,
            "paid": paymentStatus === PaymentStatusType.PAID
        };
        await updatePayment(selectedYear, paymentData);
    };

    return (
        <div className="payment-update">
            <div className="row">
                <div className="input-group">
                    <label htmlFor="unit-select">Unit Number:</label>
                    <select
                        id="unit-select"
                        value={selectedUnitAddressId}
                        onChange={(e) => setSelectedUnitAddressId(e.target.value)}
                    >
                        <option value="">--Select Unit Number--</option>
                        {Object.values(UnitNumbers).map((unit: EnumOption) => (
                            <option key={unit.value} value={unit.value}>
                                {unit.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor="month-select">Month:</label>
                    <select
                        id="month-select"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    >
                        {Object.values(Months)
                            .filter((month) => {
                                if (payFrequency === PayFrequencyType.ANNUALLY.value) return month.value === 0;
                                if (payFrequency === PayFrequencyType.QUARTERLY.value) return [0, 3, 6, 9].includes(Number(month.value));
                                if (payFrequency === PayFrequencyType.SPECIAL_CONTRIBUTION.value) return false;
                                return true; // Show all months by default
                            })
                            .map((month) => (
                                <option key={month.value} value={month.value} disabled={payFrequency === PayFrequencyType.ANNUALLY.value || payFrequency === PayFrequencyType.SPECIAL_CONTRIBUTION.value}>
                                    {month.label}
                                </option>
                            ))}
                    </select>
                </div>
            </div>

            <div className="row">
                <div className="input-group">
                    <label htmlFor="pay-frequency-select">Pay Frequency:</label>
                    <select
                        id="pay-frequency-select"
                        value={payFrequency}
                        onChange={(e) => setPayFrequency(Number(e.target.value))}
                    >
                        {Object.values(PayFrequencyType).map((type: EnumOption) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor="status-select">Payment Status:</label>
                    <select
                        id="status-select"
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                    >
                        {Object.values(PaymentStatusType).map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <button className="submit-payment-update-button"
                onClick={() => {
                    submitPaymentUpdate(Number(selectedMonth), Number(payFrequency), paymentStatus, selectedUnitAddressId);
                    window.location.reload(); // Refresh the page after submitting
                }}
            >
                Submit
            </button>
        </div>
    );
};

export default PaymentUpdate;
