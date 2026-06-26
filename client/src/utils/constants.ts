export const CATEGORIES = [
  { value: "FINANCIAL_MISCONDUCT", label: "Financial Misconduct" },
  { value: "HARASSMENT", label: "Harassment" },
  { value: "DATA_PRIVACY", label: "Data Privacy" },
  { value: "SAFETY", label: "Safety" },
  { value: "POLICY_VIOLATION", label: "Policy Violation" },
  { value: "FRAUD", label: "Fraud" },
  { value: "CONFLICT_OF_INTEREST", label: "Conflict of Interest" },
  { value: "OTHER", label: "Other" },
];

export const SEVERITIES = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

export const STATUS_LABELS: Record<string, string> = {
  SUBMITTED: "Submitted",
  ACKNOWLEDGED: "Acknowledged",
  UNDER_REVIEW: "Under Review",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};
