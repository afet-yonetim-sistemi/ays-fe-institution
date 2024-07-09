export interface PhoneNumber {
    countryCode: string;
    lineNumber: string;
  }
  
  export interface User {
    id: string;
    firstName: string;
    lastName: string;
    city: string;
    emailAddress: string;
    phoneNumber: PhoneNumber;
  }
  
  export interface Institution {
    id: string;
    name: string;
  }
  
  export interface AdminRegistrationApplication {
    createdUser: string;
    createdAt: string;
    updatedUser: string;
    updatedAt: string;
    id: string;
    reason: string;
    rejectReason: string | null;
    status: string;
    institution: Institution;
    user: User;
  }
  
  export interface ApiResponse {
    time: string;
    isSuccess: boolean;
    response: AdminRegistrationApplication;
  }
  