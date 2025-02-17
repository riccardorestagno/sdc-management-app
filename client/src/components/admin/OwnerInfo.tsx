import { useEffect, useState } from "react";
import { getOwnerInfoByUnitAddressId } from "../../services/api";

interface OwnerInfoProps {
    name: string;
    email: string;
    number: string;
    admin?: boolean;
}

const OwnerInfo = ({ selectedUnitAddressId }: { selectedUnitAddressId: string }) => {

    const [ownerInfo, setOwnerInfo] = useState<OwnerInfoProps>({} as OwnerInfoProps);

    useEffect(() => {
        const fetchOwnerInfo = async () => {
            try {
                const data = await getOwnerInfoByUnitAddressId(selectedUnitAddressId);
                setOwnerInfo(data);
            } catch (err) {
                setOwnerInfo({} as OwnerInfoProps);
            }
        };

        fetchOwnerInfo();
    }, [selectedUnitAddressId]);

    return (
        <div className="owner-info-container">
            <div>
                <label>Owner name: {ownerInfo.name}</label>
            </div>
            <div>
                <label>Owner email: {ownerInfo.email}</label>
            </div>
            <div>
                <label>Owner phone number: {ownerInfo.number}</label>
            </div>
            <div>
                <label>Notes on file:</label>
            </div>
        </div>
    );
};

export default OwnerInfo;
