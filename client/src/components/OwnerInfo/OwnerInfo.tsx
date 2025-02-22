import { useEffect, useState } from "react";
import { getOwnerInfoByUnitAddressId, updateOwnerInfoByUnitAddressId } from "../../services/api";
import './OwnerInfo.css'

interface OwnerInfoProps {
    name: string;
    email: string;
    number: string;
    monthly_fee: number;
    admin?: boolean;
}

const OwnerInfo = ({ selectedUnitAddressId, displayBasicInfoOnly = false }: { selectedUnitAddressId: string, displayBasicInfoOnly?: boolean }) => {

    const [ownerInfo, setOwnerInfo] = useState<OwnerInfoProps>({} as OwnerInfoProps);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOwnerInfo({
            ...ownerInfo,
            [e.target.name]: e.target.value,
        });
    };

    const saveChanges = async () => {
        setLoading(true);
        try {
            const response = await updateOwnerInfoByUnitAddressId(selectedUnitAddressId, ownerInfo);

            if (!response.ok) {
                throw new Error("Failed to save changes");
            }

            console.log("Saved successfully!");
        } catch (error) {
            console.error("Error saving owner info:", error);
        } finally {
            setLoading(false);
            setIsEditing(false);
        }
    };

    const toggleEdit = () => {
        if (isEditing) {
            saveChanges();
        } else {
            setIsEditing(true);
        }
    };

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
        <div className="owner-info-section owner-info-card">
            <p>
                <span className="owner-info-label">Name:</span>
                {isEditing ? (
                    <input
                        type="text"
                        name="name"
                        value={ownerInfo.name}
                        onChange={handleChange}
                        className="owner-info-input"
                    />
                ) : (
                    <span> {ownerInfo.name}</span>
                )}
            </p>
            <p>
                <span className="owner-info-label">Email:</span>
                {isEditing ? (
                    <input
                        type="email"
                        name="email"
                        value={ownerInfo.email}
                        onChange={handleChange}
                        className="owner-info-input"
                    />
                ) : (
                    <span> {ownerInfo.email}</span>
                )}
            </p>
            <p>
                <span className="owner-info-label">Phone number:</span>
                {isEditing ? (
                    <input
                        type="tel"
                        name="number"
                        value={ownerInfo.number}
                        onChange={handleChange}
                        className="owner-info-input"
                    />
                ) : (
                    <span> {ownerInfo.number}</span>
                )}
            </p>
            {!displayBasicInfoOnly &&
                <div><p>
                    <span className="owner-info-label">Monthly fee:</span>{" "}
                    {ownerInfo.monthly_fee !== null && ownerInfo.monthly_fee !== undefined
                        ? `$${(Math.round(ownerInfo.monthly_fee * 100) / 100).toFixed(2)}`
                        : "N/A"}
                </p>

                    <p><span className="owner-info-label">Notes on file:</span></p>

                    <button
                        onClick={toggleEdit}
                        className="owner-info-button"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : isEditing ? "Save" : "Edit"}
                    </button>
                </div>}
        </div>
    );
};

export default OwnerInfo;
