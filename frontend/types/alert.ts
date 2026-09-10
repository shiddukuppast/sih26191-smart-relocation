export type AlertSeverity = "critical" | "high" | "medium" | "info";
export type AlertCategory = 
  | "Critical Hazard" 
  | "New Red Zone" 
  | "Population Threshold" 
  | "Safe Capacity Warning" 
  | "Infrastructure Warning" 
  | "Model Alert";

export interface DisasterAlert {
  id: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  description: string;
  timestamp: string;
  timeAgo: string;
  relatedHabitationId?: string;
  relatedSiteId?: string;
  isRead: boolean;
}
