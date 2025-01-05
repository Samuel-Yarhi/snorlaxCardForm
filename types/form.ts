// Add your form types here
export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  portfolioUrl?: string;
}

export interface Experience {
  currentRole: string;
  yearsOfExperience: number;
  skills: string[];
  company: string;
  achievement: string;
}

export interface ApplicationForm extends PersonalInfo, Experience {}