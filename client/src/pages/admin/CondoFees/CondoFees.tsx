import { useState } from 'react';
import './CondoFees.css';
import OwnerInfo from '../../../components/admin/OwnerInfo';
import PaymentUpdate from './components/PaymentUpdate';
import PaymentTable from './components/PaymentTable';

const CondoFees = ({ currentYear }: { currentYear: number }) => {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedUnitAddressId, setSelectedUnitAddressId] = useState('');

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <PaymentTable
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        setSelectedUnitAddressId={setSelectedUnitAddressId}
      />

      {selectedYear === currentYear && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "18px" }}>
          <PaymentUpdate
            selectedYear={selectedYear}
            selectedUnitAddressId={selectedUnitAddressId}
            setSelectedUnitAddressId={setSelectedUnitAddressId}
          />
          <OwnerInfo selectedUnitAddressId={selectedUnitAddressId} />
        </div>
      )}
    </div>

  );
};

export default CondoFees;
