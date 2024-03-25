export interface ICompany {
  _id: string;
  company: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  number: string;
  zip: string;
  city: string;
  licenseNum: string;
}

export interface IAdmin {
  _id: string;
  email: string;
  password: string;
  emailVerified: boolean;
  mailVerificationToken: string;
}

export interface IDriver {
  _id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  licenseNum: string;
  licenseType: string;
  typeValidU: string;
  codeNum: string;
  codeNumValidU: string;
  driverCardNum: string;
  driverCardNumValidU: string;
}

export interface IVehicle {
  _id: string;
  companyId: string;
  indicator: string;
  brand: string;
  type: string;
  weight: string;
  nextHU: string;
  nextSP: string;
}
