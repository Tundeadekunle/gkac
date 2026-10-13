export const SCHOOL_NAME = "Glorious King Academy and College";
export const SCHOOL_SHORT_NAME = "GKAC";
export const SCHOOL_MOTTO = "Crown of Wisdom • Virtue and Excellence";
export const SCHOOL_ACADEMIC_WINGS = "Primary • College";
export const SCHOOL_ADDRESS = "Plot 12, Royal Avenue, Knowledge City";
export const SCHOOL_PHONE = "+234 800 GKAC EDU";
export const SCHOOL_EMAIL = "info@gloriouskingacademy.edu.ng";

export const PRIMARY_CLASSES = [
  "KG 1",
  "KG 2",
  "Nursery 1",
  "Nursery 2",
  "Nursery 3",
  "Basic 1",
  "Basic 2",
  "Basic 3",
  "Basic 4",
  "Basic 5",
  "Basic 6"
];

export const SECONDARY_CLASSES = [
  "JSS 1",
  "JSS 2",
  "JSS 3",
  "SSS 1 (Science)",
  "SSS 1 (Arts)",
  "SSS 1 (Commercial)",
  "SSS 2 (Science)",
  "SSS 2 (Arts)",
  "SSS 2 (Commercial)",
  "SSS 3 (Science)",
  "SSS 3 (Arts)",
  "SSS 3 (Commercial)"
];

export const ALL_CLASSES = [...PRIMARY_CLASSES, ...SECONDARY_CLASSES];

export const CLASS_ARMS = [
  "Gold",
  "Diamond",
  "Silver",
  "Emerald",
  "A",
  "B",
  "C"
];

export const AFFECTIVE_TRAITS = [
  "Punctuality",
  "Neatness & Personal Hygiene",
  "Politeness & Courtesy",
  "Honesty & Reliability",
  "Relationship with Peers",
  "Self Control & Discipline",
  "Attentiveness in Class",
  "Spirit of Co-operation"
];

export const PSYCHOMOTOR_SKILLS = [
  "Handwriting / Penmanship",
  "Verbal & Reading Fluency",
  "Sports & Physical Games",
  "Arts, Crafts & Creativity",
  "Musical / Cultural Skills",
  "Handling of Tools & Lab Apparatus"
];

export const RATING_SCALE = [
  { value: 5, label: "5 - Excellent" },
  { value: 4, label: "4 - Good" },
  { value: 3, label: "3 - Fair" },
  { value: 2, label: "2 - Poor" },
  { value: 1, label: "1 - Very Poor" }
];

export function calculateGrade(total: number) {
  const rounded = Math.round(total * 10) / 10;
  if (rounded >= 75) return { grade: "A" as const, remark: "Distinction / Excellent", points: 5 };
  if (rounded >= 65) return { grade: "B" as const, remark: "Very Good", points: 4 };
  if (rounded >= 50) return { grade: "C" as const, remark: "Credit / Good", points: 3 };
  if (rounded >= 45) return { grade: "D" as const, remark: "Pass / Fair", points: 2 };
  if (rounded >= 40) return { grade: "E" as const, remark: "Weak Pass", points: 1 };
  return { grade: "F" as const, remark: "Fail / Needs Improvement", points: 0 };
}

export const INITIAL_SUBJECTS = [
  { id: "sub_1", name: "Mathematics", code: "MTH", section: "BOTH" as const },
  { id: "sub_2", name: "English Language", code: "ENG", section: "BOTH" as const },
  { id: "sub_3", name: "Number Work", code: "NWK", section: "PRIMARY" as const },
  { id: "sub_4", name: "Letter Work", code: "LTW", section: "PRIMARY" as const },
  { id: "sub_5", name: "Rhymes & Poems", code: "RHY", section: "PRIMARY" as const },
  { id: "sub_6", name: "Health & Physical Habits", code: "HPH", section: "PRIMARY" as const },
  { id: "sub_7", name: "Basic Science & Technology", code: "BST", section: "PRIMARY" as const },
  { id: "sub_8", name: "Social Studies & Civic Education", code: "SSC", section: "BOTH" as const },
  { id: "sub_9", name: "Christian Religious Studies / IRS", code: "CRS", section: "BOTH" as const },
  { id: "sub_10", name: "Agricultural Science", code: "AGR", section: "BOTH" as const },
  { id: "sub_11", name: "Information & Comm. Technology (ICT)", code: "ICT", section: "BOTH" as const },
  { id: "sub_12", name: "Physics", code: "PHY", section: "SECONDARY" as const },
  { id: "sub_13", name: "Chemistry", code: "CHM", section: "SECONDARY" as const },
  { id: "sub_14", name: "Biology", code: "BIO", section: "SECONDARY" as const },
  { id: "sub_15", name: "Economics", code: "ECO", section: "SECONDARY" as const },
  { id: "sub_16", name: "Government", code: "GOV", section: "SECONDARY" as const },
  { id: "sub_17", name: "Financial Accounting", code: "ACC", section: "SECONDARY" as const },
  { id: "sub_18", name: "Commerce", code: "COM", section: "SECONDARY" as const },
  { id: "sub_19", name: "Literature in English", code: "LIT", section: "SECONDARY" as const }
];
