import EnumOption from "./enumOption";

export const PayFrequencyType: { [key: string]: EnumOption } = {
    MONTHLY: { value: 1, label: 'Monthly' },
    QUARTERLY: { value: 3, label: 'Quarterly' },
    ANNUALLY: { value: 12, label: 'Annually' },
    SPECIAL_CONTRIBUTION: { value: 0, label: 'Special contribution' }
};

export default PayFrequencyType;