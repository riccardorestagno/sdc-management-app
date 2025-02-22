import React from 'react';

interface ButtonProps {
    label: string;
    onClick: () => void;
}

const SelectableAddressButton: React.FC<ButtonProps> = ({ label, onClick }) => {
    return (
        <button
            onClick={onClick}
            style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                textAlign: 'left',
                fontSize: 'inherit',
                color: 'inherit',
                width: '100%',
            }}
            onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'scale(1.05)';
                target.style.color = '#007bff';
            }}
            onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'scale(1)';
                target.style.color = 'inherit';
            }}
        >
            {label}
        </button>
    );
};

export default SelectableAddressButton;
