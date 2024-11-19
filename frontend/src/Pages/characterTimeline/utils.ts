export const formatDate = (date: {
  ceYear: number;
  monthNumber: number;
  day: number;
  isAD: boolean;
}) => {
  const months = [
    "Genesis",
    "Synthesis",
    "Ascension",
    "Directive",
    "Convergence",
    "Dominion",
    "Surge",
    "Resonance",
    "Veil",
    "Eclipse",
    "Zenith",
    "Fracture",
  ];

  return `${months[date.monthNumber - 1]} ${date.day}, ${Math.abs(
    date.ceYear
  )} ${date.isAD ? "CE" : "AA"}`;
};
