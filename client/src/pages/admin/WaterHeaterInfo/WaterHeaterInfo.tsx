import { useEffect, useState } from 'react';
import './WaterHeaterInfo.css';
import { getUnitInfoList } from '../../../services/api';
import UnitNumbers from '../../../enums/unitNumbers';
import SelectableAddressButton from '../../../components/admin/SelectableAddressButton';
import OwnerInfo from '../../../components/admin/OwnerInfo';

const WaterHeaterInfo = () => {

    interface UnitInfoProps {
        address: string;
        last_water_heater_replacement: Date;
        has_tankless_heater: boolean;
    }

    const [unitInfoList, setUnitInfoList] = useState<UnitInfoProps[]>([]);
    const [selectedUnitAddressId, setSelectedUnitAddressId] = useState('');

    const formatDate = (date: Date | null) => {
        return date ? date.toLocaleDateString() : "";
    };

    const addTenYearsAndFormat = (date: Date | null) => {
        if (!date) return "";
        const newDate = new Date(date);
        newDate.setFullYear(newDate.getFullYear() + 10);
        return newDate.toLocaleDateString();
    };

    useEffect(() => {
        const fetchUnitInfoList = async () => {
            try {
                const data = await getUnitInfoList();
                setUnitInfoList(data);
            } catch (err) {
                setUnitInfoList([]);
            }
        };

        fetchUnitInfoList();
    }, []);

    return (
        <div className="data-container">
            <div className="data-content">
                <div className="data-scrollable">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <td key='address'>Address</td>
                                <td key='last-replaced'>Last Replaced</td>
                                <td key='to-be-replaced'>To be Replaced</td>
                                <td key='tankless'>Tankless</td>
                            </tr>
                        </thead>
                        <tbody>
                            {unitInfoList.map((unit, index) => (
                                <tr key={index}>
                                    <td>
                                        <SelectableAddressButton
                                            label={UnitNumbers[unit.address].label}
                                            onClick={() => setSelectedUnitAddressId(String(UnitNumbers[unit.address].value))}
                                        />
                                    </td>
                                    <td>{formatDate(unit.last_water_heater_replacement ? new Date(unit.last_water_heater_replacement) : null)}</td>
                                    <td>{addTenYearsAndFormat(unit.last_water_heater_replacement ? new Date(unit.last_water_heater_replacement) : null)}</td>
                                    <td>{unit.has_tankless_heater ? "YES" : "NO"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <OwnerInfo selectedUnitAddressId={selectedUnitAddressId} />
            </div>
        </div>
    );
};

export default WaterHeaterInfo;