import { useState } from 'react';
import './CondoFees.css';
import OwnerInfo from './components/OwnerInfo';
import PaymentUpdate from './components/PaymentUpdate';
import PaymentTable from './components/PaymentTable';

const CondoFees = ({ currentYear }: { currentYear: number }) => {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedUnitAddressId, setSelectedUnitAddressId] = useState('');

  return (
    <div>
      <PaymentTable selectedYear={selectedYear} setSelectedYear={setSelectedYear} setSelectedUnitAddressId={setSelectedUnitAddressId} />

      {selectedYear === currentYear && (
        <>
          <PaymentUpdate selectedYear={selectedYear} selectedUnitAddressId={selectedUnitAddressId} setSelectedUnitAddressId={setSelectedUnitAddressId} />
          <OwnerInfo selectedUnitAddressId={selectedUnitAddressId} />
        </>
      )}
    </div>

  );
};

export default CondoFees;
