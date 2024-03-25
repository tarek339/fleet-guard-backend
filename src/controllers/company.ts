import { Request, Response } from "express";
import { Company } from "../models/company";
import { Error, mongooseErrorHandler } from "../types/interfaces";
import { Driver } from "../models/driver";
import { Truck } from "../models/truck";
import { Trailer } from "../models/trailer";

export const registerCompany = async (req: Request, res: Response) => {
  try {
    const company = new Company({
      adminId: req.body.adminId,
      company: req.body.company,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      street: req.body.street,
      number: req.body.number,
      zip: req.body.zip,
      city: req.body.city,
      licenseNum: req.body.licenseNum,
    });
    await company.save();

    res.json({
      message: "Company profile created",
      company: {
        _id: company._id,
        company: company.company,
        firstName: company.firstName,
        lastName: company.lastName,
        email: company.email,
        phone: company.phone,
        street: company.street,
        number: company.number,
        zip: company.zip,
        city: company.city,
        licenseNum: company.licenseNum,
      },
    });
  } catch (err) {
    res.status(422).json({
      message: mongooseErrorHandler(err as Error),
    });
  }
};

export const fetchCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await Company.find();
    res.json({ companies });
  } catch (err) {
    res.status(422).json({
      message: mongooseErrorHandler(err as Error),
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const profile = await Company.findById(req.params.id);
    res.json(profile);
  } catch (err) {
    res.status(422).json({
      message: mongooseErrorHandler(err as Error),
    });
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    await Driver.deleteMany({ companyId: req.params.id });
    await Truck.deleteMany({ companyId: req.params.id });
    await Trailer.deleteMany({ companyId: req.params.id });

    res.json({
      message: "Profile deleted",
    });
  } catch (err) {
    res.status(422).json({
      message: mongooseErrorHandler(err as Error),
    });
  }
};

export const editProfile = async (req: Request, res: Response) => {
  try {
    const company = await Company.findById(req.params.id);
    (company.company = req.body.company),
      (company.firstName = req.body.firstName),
      (company.lastName = req.body.lastName),
      (company.email = req.body.email),
      (company.phone = req.body.phone),
      (company.street = req.body.street),
      (company.number = req.body.number),
      (company.zip = req.body.zip),
      (company.city = req.body.city),
      (company.licenseNum = req.body.licenseNum),
      await company.save();
    res.json({
      message: "Profile data changed",
      company,
    });
  } catch (error) {
    res.status(422).json({
      message: mongooseErrorHandler(error as Error),
    });
  }
};

export const getCompanyProperties = async (req: Request, res: Response) => {
  const drivers = await Driver.find({ companyId: req.params.id });
  const trucks = await Truck.find({ companyId: req.params.id });
  const trailers = await Trailer.find({ companyId: req.params.id });
  res.json({ drivers, trucks, trailers });
};
