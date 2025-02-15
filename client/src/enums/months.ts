import EnumOption from "./enumOption";

export const Months: { [key: string]: EnumOption } = {
    JANUARY: { value: 0, label: 'January' },
    FEBRUARY: { value: 1, label: 'February' },
    MARCH: { value: 2, label: 'March' },
    APRIL: { value: 3, label: 'April' },
    MAY: { value: 4, label: 'May' },
    JUNE: { value: 5, label: 'June' },
    JULY: { value: 6, label: 'July' },
    AUGUST: { value: 7, label: 'August' },
    SEPTEMBER: { value: 8, label: 'September' },
    OCTOBER: { value: 9, label: 'October' },
    NOVEMBER: { value: 10, label: 'November' },
    DECEMBER: { value: 11, label: 'December' }
};

export default Months;