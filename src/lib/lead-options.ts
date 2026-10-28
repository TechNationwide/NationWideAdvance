export const CAPITAL_OPTIONS = [
  "$5,000 - $10,000",
  "$10,000 - $20,000",
  "$20,000 - $50,000",
  "$50,000 - $100,000",
  "$100,000 - $250,000",
  "$250,000 - $500,000",
  "$500,000 - $1,000,000",
  "$1,000,000+",
] as const;

export const TIME_IN_BUSINESS_OPTIONS = [
  "Less than 6 months",
  "6 - 12 months",
  "1 - 2 years",
  "2 - 5 years",
  "5 + years",
] as const;

export const BANK_ACCOUNT_OPTIONS = ["Yes", "No"] as const;

export const INDUSTRY_OPTIONS = [
  "Accounting / CPA",
  "Adult Entertainment / Novelty Store",
  "Auto Detail Services",
  "Auto Mechanic",
  "Auto Sales",
  "Autobody Repair And Service",
  "Bail Bonds",
  "Boat Sales",
  "Cannabis",
  "Carwash",
  "Casino",
  "Church / Places Of Worship",
  "Concert / Event Planning",
  "Construction",
  "Credit Repair Services",
  "Daycare / Schools Or Academys",
  "Electrical Services",
  "Equipment / Auto / Tool Rental Services",
  "Farming",
  "Finance Company",
  "Firearms / Ammunition",
  "Forestry / Logging",
  "Funeral Home / Services",
  "Gas Station",
  "General Contractor",
  "Grocery / Hardware Store",
  "Gym / Fitness Services",
  "Hotels",
  "HVAC Services",
  "Insurance Agency / Services",
  "Janitorial / Cleaning Services",
  "Jewerly Retail Or Wholesale",
  "Landscaping / Lawncare / Grading Services",
  "Lawyers",
  "Manufacturing / Industrial Plants / Recycling",
  "Marketing / Consulting / It / Communication / Data Services",
  "Medical / Veterinarian / Specialty Services",
  "Moving / Furniture Delivery Services",
  "Nail Salons / Hair Salons / Tanning Salons / Beauty Supply / Spa",
  "Non-Profit",
  "Nursing / Senior Care / Rehab Facility / Hospice",
  "Pawn Shop",
  "Payday Loans / Check Cashing / Debt Collection Agencies",
  "Payroll Services",
  "Pharmacy / Drug Store",
  "Plumbing",
  "Real Estate / Real Estate Agency",
  "Restaurant / Bar / Catering Services",
  "Retail Goods / Online Ecommerce",
  "Roofing",
  "RV Sales",
  "Security Firms / Services",
  "Shipping / Distribution Services",
  "Solar",
  "Staffing And Recruiting Agencies",
  "Tabacco / Vape Shop",
  "Tax Services",
  "Towing Service",
  "Trucking / Transportation",
  "Wholesale / Distribution",
  "Other",
] as const;

export type LeadData = {
  capitalNeeded: string;
  businessName: string;
  timeInBusiness: string;
  businessBankAccount: string;
  industry: string;
  phone: string;
};
