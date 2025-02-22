import { useState } from "react";
import { AdminTabs } from "../../enums/adminTabs";
import { CoOwnerTabs } from "../../enums/coOwnerTabs";
import { AccessType } from "../../enums/accessType";
import CondoFees from "../admin/CondoFees/CondoFees";
import WaterHeaterInfo from "../admin/WaterHeaterInfo/WaterHeaterInfo";
import './Dashboard.css'
import Header from "../../components/Header/Header";

const Dashboard = () => {
    const [activeColumn, setActiveColumn] = useState(0);
    const [activeRow, setActiveRow] = useState([0, 0]);

    const columnTabs = [AccessType.ADMIN, AccessType.COOWNER];
    const rowTabs = [
        [AdminTabs.CONDO_FEES, AdminTabs.BANK_ACCOUNT, AdminTabs.TANK_REPLACEMENT],
        [CoOwnerTabs.OWNER_INFO, CoOwnerTabs.NOTIFICATIONS],
    ];

    const renderDetails = () => {
        switch (columnTabs[activeColumn]) {
            case AccessType.ADMIN:
                switch (rowTabs[activeColumn][activeRow[activeColumn]]) {
                    case AdminTabs.CONDO_FEES:
                        return <CondoFees currentYear={2025} />;
                    // case AdminTabs.BANK_ACCOUNT:
                    //   return <AdminBankAccount />;
                    case AdminTabs.TANK_REPLACEMENT:
                        return <WaterHeaterInfo />;
                    default:
                        return <p>No details available for this row.</p>;
                }
            case AccessType.COOWNER:
                switch (rowTabs[activeColumn][activeRow[activeColumn]]) {
                    // case CoOwnerTabs.OWNER_INFO:
                    //   return <OwnerInfo />;
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
        <div>
            <Header />

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
                                className={`row-tab ${activeRow[activeColumn] === rowIndex ? "active" : ""}`}
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
                    <div className="details">{renderDetails()}</div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
