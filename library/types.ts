import { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  submenu?: {
    title: string;
    href: string;
  }[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  slug: string;
  icon: string | LucideIcon;
  features: string[];
  category: string[];
  details?: {
    specifications?: {
      category: string;
      items: { label: string; value: string }[];
    }[];
    process?: {
      title: string;
      description: string;
      image?: string;
      visualization?: {
        type: 'image' | 'diagram' | 'model' | 'video';
        src: string;
        alt?: string;
      };
      keyPoints?: string[];
      tools?: string[];
      deliverables?: string[];
      timeline?: string;
    }[];
    gallery?: string[];
  };
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  image: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags: string[];
  stock: number;
  rating: number;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  image: string;
  bio: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  expertise?: string[];
  achievements?: string[];
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface Stat {
  label: string;
  value: string;
  description?: string;
  prefix?: string;
  suffix?: string;
}

export interface CompanyValue {
  title: string;
  description: string;
  icon?: string;
}

// --- Zoho-specific types ---
// types.ts — APPEND the following (do not remove existing exports)

// CRM v8
export interface CrmLeadUpsertResponse {
data: Array<{
code: string;
details: { id: string; created_time?: string; modified_time?: string };
status: "success" | "error";
message?: string;
}>;
}
export interface CrmField {
api_name: string;
data_type: string;
display_label?: string;
pick_list_values?: Array<{ display_value: string; actual_value: string }>;
}
export interface CrmFieldsResponse {
modules?: Array<{ api_name: string; fields: CrmField[] }>;
fields?: CrmField[]; // some orgs return flat shape
}


// Bookings
export interface BookingSlotsReturnValue { data?: string[] }
export interface BookingsAvailabilityResponse {
response?: { returnvalue?: BookingSlotsReturnValue | string[] };
slots?: string[];
}
export interface BookingsCreateResponse {
response?: { returnvalue?: { booking_id?: string; summary_url?: string; [k: string]: any } };
}


// WorkDrive
export interface WorkDriveNodeAttributes { name: string; perm_link?: string; type?: "folder" | "file"; size?: number }
export interface WorkDriveDatum { id: string; attributes: WorkDriveNodeAttributes }
export interface WorkDriveFolderCreateResponse { data: WorkDriveDatum[] }
export interface WorkDriveUploadResponse { data: WorkDriveDatum[] }


// Campaigns
export interface CampaignsSubscribeResponse { code?: string; message?: string; contact?: { email: string; status: string }; [k: string]: any }


// Common
export interface ZohoError { code?: string; message?: string; status?: string; details?: any }