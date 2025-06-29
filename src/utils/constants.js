export const governorates = [
  { name: "Alexandria", title: "الإسكندرية" },
  { name: "Aswan", title: "أسوان" },
  { name: "Asyut", title: "أسيوط" },
  { name: "Beheira", title: "البحيرة" },
  { name: "BeniSuef", title: "بني سويف" },
  { name: "Cairo", title: "القاهرة" },
  { name: "Dakahlia", title: "الدقهلية" },
  { name: "Damietta", title: "دمياط" },
  { name: "Fayoum", title: "الفيوم" },
  { name: "Gharbia", title: "الغربية" },
  { name: "Giza", title: "الجيزة" },
  { name: "Ismailia", title: "الإسماعيلية" },
  { name: "KafrElSheikh", title: "كفر الشيخ" },
  { name: "Luxor", title: "الأقصر" },
  { name: "Matrouh", title: "مطروح" },
  { name: "Minya", title: "المنيا" },
  { name: "Monufia", title: "المنوفية" },
  { name: "NewValley", title: "الوادي الجديد" },
  { name: "NorthSinai", title: "شمال سيناء" },
  { name: "PortSaid", title: "بورسعيد" },
  { name: "Qalyubia", title: "القليوبية" },
  { name: "Qena", title: "قنا" },
  { name: "RedSea", title: "البحر الأحمر" },
  { name: "Sharqia", title: "الشرقية" },
  { name: "Sohag", title: "سوهاج" },
  { name: "SouthSinai", title: "جنوب سيناء" },
  { name: "Suez", title: "السويس" },
];

export const MIN = 1;
export const MAX = 10000;
export const percentage = (val, MIN, MAX) => ((val - MIN) / (MAX - MIN)) * 100;
