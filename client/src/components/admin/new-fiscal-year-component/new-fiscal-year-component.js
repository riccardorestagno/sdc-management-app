import React, { useState } from "react";

const NewFiscalYear = ({ exists, onSubmit, onDelete }) => {
  const [percentIncrease, setPercentIncrease] = useState("");
  const [specialContribution, setSpecialContribution] = useState("");


  const handlePercentIncreaseChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPercentIncrease(value);
    }
  };

  const handleSpecialContributionChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setSpecialContribution(value);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        {!exists && (
          <>
            <input
              type="text"
              value={percentIncrease}
              onChange={handlePercentIncreaseChange}
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter % increase from prior year"
            />
            <input
              type="text"
              value={specialContribution}
              onChange={handleSpecialContributionChange}
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter special contribution amount"
            />
          </>
        )}
        <div className="flex justify-end space-x-2">
          {exists ? (
            <button onClick={() => onDelete()} className="px-4 py-2 bg-blue-500 text-white rounded">Delete</button>
          ) : (
            <button onClick={() => onSubmit(percentIncrease, specialContribution)} className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewFiscalYear;
