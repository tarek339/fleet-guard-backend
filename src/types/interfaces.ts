interface ErrorMessage {
  message: string;
}

export interface Error {
  errors: Record<any, ErrorMessage>;
  message: string;
}

export const mongooseErrorHandler = (error: Error) => {
  var errorMessage = null;
  if (error.errors) errorMessage = Object.values(error.errors)[0].message;
  return errorMessage || error.message;
};

export interface ICompaniesTruck {
  [companyId: string]: ITruckProps[];
}

export interface ITruckProps {
  company: string | null;
  email: string | null;
  indicator: string;
  nextHU: string;
  nextSP: string;
  nextTacho: string;
}

export interface ICompaniesTrailer {
  [companyId: string]: ITrailerProps[];
}

export interface ITrailerProps {
  company: string | null;
  email: string | null;
  indicator: string;
  nextHU: string;
  nextSP: string;
}

export interface ICompaniesDrivers {
  [companyId: string]: IDriversProps[];
}

export interface IDriversProps {
  company: string | null;
  email: string | null;
  firstName: string;
  lastName: string;
  licenseType: string;
  typeValidU: string;
  codeNumValidU: string;
  driverCardNumValidU: string;
}
