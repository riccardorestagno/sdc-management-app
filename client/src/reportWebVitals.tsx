import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals';

type ReportWebVitalsCallback = (metric: any) => void;

const reportWebVitals = (onPerfEntry?: ReportWebVitalsCallback): void => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    onCLS(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

export default reportWebVitals;
