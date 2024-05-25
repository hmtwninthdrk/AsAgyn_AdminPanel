export const durationToSeconds = (duration) => {
  const timeUnits = {
    'мин': 60,       
    'час': 3600,     
  };

  const regex = /(\d+)\s*(мин|час)/g;

  let totalSeconds = 0;
  let match;

  while ((match = regex.exec(duration)) !== null) {
    const value = parseInt(match[1], 10);
    const unit = match[2];
    totalSeconds += value * timeUnits[unit];
  }

  return totalSeconds;
};

export const secondsToDuration = (seconds) => {
  const units = [
    { label: 'час', sec: 3600 },
    { label: 'мин', sec: 60 },
  ];

  let remainingSeconds = seconds;
  const parts = [];

  units.forEach(unit => {
    const value = Math.floor(remainingSeconds / unit.sec);
    if (value > 0) {
      parts.push(`${value} ${unit.label}${value > 1 ? '' : ''}`);
      remainingSeconds -= value * unit.sec;
    }
  });

  return parts.join(' ');
};
