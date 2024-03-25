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

export interface ICompanyDrivers {
  driver: {
    company: string;
    companyId: string;
    email: string;
    driverId: string;
    firstName: string;
    lastName: string;
    typeValidU: string;
    codeNumVU: string;
    cardNumVU: string;
  };
}

export interface ICompanyTrailer {
  trailer: {
    companyId: string;
    company: string;
    email: string;
    trailerId: string;
    indicator: string;
    nextHU: string;
    nextSP: string;
  };
}

export interface ICompanyTruck {
  truck: {
    companyId: string;
    company: string;
    email: string;
    truckId: string;
    indicator: string;
    nextHU: string;
    nextSP: string;
  };
}
