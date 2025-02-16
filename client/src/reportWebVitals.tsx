const { getCLS, getFID, getFCP, getLCP, getTTFB } = require('web-vitals');

type ReportWebVitalsCallback = (metric: any) => void;

const reportWebVitals = (onPerfEntry?: ReportWebVitalsCallback): void => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
};

export default reportWebVitals;
