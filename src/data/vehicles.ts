/**
 * Seed inventory for the ground-truth data cards (Improvement 2).
 * Continues the Lisa/RAV4/CR-V scenario established across the discovery
 * evidence for narrative continuity, extended with one vehicle per persona
 * so every ChallengeBoard scenario has something real to surface mid-call.
 */

export type Vehicle = {
  stock: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  color: string;
  miles: number;
  price: number;
  features: string[];
  available: boolean;
  hasPhoto: boolean;
  /** Set only on the one vehicle used for the defect-disclosure scenario. */
  recall?: string;
};

export const vehicles: Record<string, Vehicle> = {
  "D-RAV4": {
    stock: "D-RAV4",
    year: 2023,
    make: "Toyota",
    model: "RAV4",
    trim: "XLE",
    color: "Silver Sky",
    miles: 18600,
    price: 32400,
    features: [
      "Toyota Safety Sense 2.0",
      "Apple CarPlay / Android Auto",
      "Heated front seats",
      "Blind spot monitor",
    ],
    available: true,
    hasPhoto: true,
  },
  "D-CRV": {
    stock: "D-CRV",
    year: 2022,
    make: "Honda",
    model: "CR-V",
    trim: "EX-L",
    color: "Modern Steel",
    miles: 24100,
    price: 29800,
    features: [
      "Honda Sensing suite",
      "Leather seating",
      "Power tailgate",
      "Wireless phone charging",
    ],
    available: true,
    hasPhoto: true,
  },
  "D-COROLLA": {
    stock: "D-COROLLA",
    year: 2019,
    make: "Toyota",
    model: "Corolla",
    trim: "LE",
    color: "Celestial Silver",
    miles: 61200,
    price: 15900,
    features: ["Backup camera", "Bluetooth audio", "Cruise control"],
    available: true,
    hasPhoto: true,
    recall: "Open recall: fuel pump (safety) — free repair at any Toyota dealer",
  },
  "D-WRANGLER": {
    stock: "D-WRANGLER",
    year: 2022,
    make: "Jeep",
    model: "Wrangler",
    trim: "Sport",
    color: "Sarge Green",
    miles: 22000,
    price: 34900,
    features: ["Removable doors/top", "4x4", "Apple CarPlay", "Tow package"],
    available: true,
    hasPhoto: true,
  },
  "D-CIVIC": {
    stock: "D-CIVIC",
    year: 2021,
    make: "Honda",
    model: "Civic",
    trim: "LX",
    color: "Aegean Blue",
    miles: 34200,
    price: 23800,
    features: ["Honda Sensing", "Backup camera", "Bluetooth audio"],
    available: true,
    hasPhoto: true,
  },
  "D-ACCORD": {
    stock: "D-ACCORD",
    year: 2022,
    make: "Honda",
    model: "Accord",
    trim: "Sport",
    color: "Crystal Black",
    miles: 19800,
    price: 27200,
    features: ["Turbo 1.5L", "Sport-tuned suspension", "Wireless charging"],
    available: true,
    hasPhoto: true,
  },
  "D-VERSA": {
    stock: "D-VERSA",
    year: 2020,
    make: "Nissan",
    model: "Versa",
    trim: "S",
    color: "Fresh Powder",
    miles: 41300,
    price: 14200,
    features: ["Backup camera", "Bluetooth audio", "40 mpg highway"],
    available: true,
    hasPhoto: true,
  },
  "D-ALTIMA": {
    stock: "D-ALTIMA",
    year: 2021,
    make: "Nissan",
    model: "Altima",
    trim: "SV",
    color: "Gun Metallic",
    miles: 27600,
    price: 21900,
    features: [
      "Nissan Safety Shield 360 (standard, not an add-on)",
      "One owner, full service records",
      "Remote start",
    ],
    available: true,
    hasPhoto: true,
  },
  "D-TUCSON": {
    stock: "D-TUCSON",
    year: 2023,
    make: "Hyundai",
    model: "Tucson",
    trim: "SEL",
    color: "Amazon Grey",
    miles: 14900,
    price: 28600,
    features: ["Hyundai SmartSense", "Panoramic sunroof", "Wireless CarPlay"],
    available: true,
    hasPhoto: true,
  },
};

export const money = (n: number) => "$" + n.toLocaleString("en-US");
export const miles = (n: number) => n.toLocaleString("en-US") + " mi";
export const vehicleTitle = (v: Vehicle) =>
  `${v.year} ${v.make} ${v.model} ${v.trim}`;
