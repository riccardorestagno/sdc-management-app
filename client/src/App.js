import React, { useState } from 'react';
import './App.css'; // Create this file to style your app
import AdminCondoFees from './components/admin/condo-fees-admin-view-component/condo-fees-admin-view-component';
import HotWaterTankReplacement from './components/admin/hot-water-tank-inventory-component/hot-water-tank-inventory-component';
import { AdminTabs } from './enums/adminTabs';
import { CoOwnerTabs } from './enums/coOwnerTabs';
import { AccessType } from './enums/accessType';

const App = () => {
  // State for active column and row tabs
  const [activeColumn, setActiveColumn] = useState(0);
  const [activeRow, setActiveRow] = useState([0, 0]);

  // Data structure for tabs
  const columnTabs = [AccessType.ADMIN, AccessType.COOWNER];
  const rowTabs = [
    [AdminTabs.CONDO_FEES, AdminTabs.BANK_ACCOUNT, AdminTabs.TANK_REPLACEMENT],
    [CoOwnerTabs.CONDO_FEES, CoOwnerTabs.NOTIFICATIONS],
  ];

  const renderDetails = () => {
    switch (columnTabs[activeColumn]) {
      case AccessType.ADMIN:
        switch (rowTabs[activeColumn][activeRow[activeColumn]]) {
          case AdminTabs.CONDO_FEES:
            return <AdminCondoFees year={2025} />;
          // case AdminTabs.BANK_ACCOUNT:
          //   return <AdminBankAccount />;
          case AdminTabs.TANK_REPLACEMENT:
            return <HotWaterTankReplacement />;
          default:
            return <p>No details available for this row.</p>;
        }
      case AccessType.COOWNER:
        switch (rowTabs[activeColumn][activeRow[activeColumn]]) {
          // case CoOwnerTabs.CONDO_FEES:
          //   return <CondoFees />;
          // case CoOwnerTabs.NOTIFICATIONS:
          //   return <Notifications />;
          default:
            return <p>No details available for this row.</p>;
        }
      default:
        return <p>No details available for this column.</p>;
    }
  };

  return (
    <div className="app-container">
      <div className="columns">
        {columnTabs.map((column, columnIndex) => (
          <button
            key={columnIndex}
            className={`column-tab ${activeColumn === columnIndex ? 'active' : ''}`}
            onClick={() => setActiveColumn(columnIndex)}
          >
            {column}
          </button>
        ))}
      </div>
      <div className="content">
        <div className="rows">
          {rowTabs[activeColumn].map((row, rowIndex) => (
            <button
              key={rowIndex}
              className={`row-tab ${activeRow[activeColumn] === rowIndex ? 'active' : ''}`}
              onClick={() => {
                const updatedActiveRows = [...activeRow];
                updatedActiveRows[activeColumn] = rowIndex;
                setActiveRow(updatedActiveRows);
              }}
            >
              {row}
            </button>
          ))}
        </div>
        <div className="details">
          {activeColumn !== null && activeRow[activeColumn] !== undefined && (
            <>
              {renderDetails()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;