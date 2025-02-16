import { useState } from "react";
import { deleteFiscalYear, initializeFiscalYear } from "../../../../services/api";

const NewFiscalYear = ({ exists, year }: { exists: boolean, year: number }) => {
  const [percentIncrease, setPercentIncrease] = useState("");
  const [specialContribution, setSpecialContribution] = useState("");


  const initializeNewFiscalYear = async (percentIncrease: any, specialContributionAmount: any) => {
    const newFiscalYearData = {
      "percent_increase": percentIncrease,
      "special_contribution_amount": specialContributionAmount
    };
    await initializeFiscalYear(year, newFiscalYearData)
  };

  const handleNewFiscalYearSubmit = async (percentIncrease: any, specialContributionAmount: any) => {
    await initializeNewFiscalYear(percentIncrease, specialContributionAmount);
  };

  const handleDeleteFutureFiscalYear = async () => {
    await deleteFiscalYear(year);
  };

  const handlePercentIncreaseChange = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPercentIncrease(value);
    }
  };

  const handleSpecialContributionChange = (e: { target: { value: any; }; }) => {
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
            <button onClick={() => handleDeleteFutureFiscalYear()} className="px-4 py-2 bg-blue-500 text-white rounded">Delete</button>
          ) : (
            <button onClick={() => handleNewFiscalYearSubmit(percentIncrease, specialContribution)} className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewFiscalYear;
