import './hot-water-tank-inventory-component.css';
import UnitNumbers from '../../../enums/unitNumbers';

const HotWaterTankReplacement = () => {

    return (
        <div className="excel-container">
            <div className="excel-scrollable">
                <table className="excel-table">
                    <thead>
                        <tr>
                            <td key='address'>Address</td>
                            <td key='last-replaced'>Last Replaced</td>
                            <td key='to-be-replaced'>To be Replaced</td>
                            <td key='tankless'>Tankless</td>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(UnitNumbers).map((unit) => (
                            <tr key={unit.value}>
                                <td>{unit.label}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HotWaterTankReplacement;