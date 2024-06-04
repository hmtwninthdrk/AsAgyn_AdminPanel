import { onCLS, onFCP, onFID, onLCP, onTTFB } from "web-vitals";


const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    try {
      console.log('Starting web-vitals collection...');
      onCLS(onPerfEntry);
      onFID(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
      console.log('web-vitals collection completed.');
    } catch (error) {
      console.error('Error collecting web-vitals:', error);
    }
  }
}

export default reportWebVitals;
