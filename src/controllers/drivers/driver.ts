import { Request, Response } from "express";
import { Error, mongooseErrorHandler } from "../../types/interfaces";
import { Driver } from "../../models/driver";

export const registerDriver = async (req: Request, res: Response) => {
  try {
    const driver = new Driver({
      companyId: req.body.companyId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      licenseNum: req.body.licenseNum,
      licenseType: req.body.licenseType,
      typeValidU: req.body.typeValidU,
      codeNum: req.body.codeNum,
      codeNumValidU: req.body.codeNumValidU,
      driverCardNum: req.body.driverCardNum,
      driverCardNumValidU: req.body.driverCardNumValidU,
    });
    await driver.save();

    res.json({
      message: "Driver profile created",
      company: {
        _id: driver._id,
        firstName: driver.firstName,
        lastName: driver.lastName,
        email: driver.email,
        phoneNumber: driver.phoneNumber,
        licenseNum: driver.licenseNum,
        licenseType: driver.licenseType,
        typeValidU: driver.typeValidU,
        codeNum: driver.codeNum,
        codeNumValidU: driver.codeNumValidU,
        driverCardNum: driver.driverCardNum,
        driverCardNumValidU: driver.driverCardNumValidU,
      },
    });
  } catch (err) {
    res.status(422).json({
      message: mongooseErrorHandler(err as Error),
    });
  }
};

export const fetchDrivers = async (req: Request, res: Response) => {
  try {
    const drivers = await Driver.find();

    res.json({ drivers });
  } catch (err) {
    res.status(422).json({
      message: mongooseErrorHandler(err as Error),
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const profile = await Driver.findById(req.params.id);

    res.json(profile);
  } catch (err) {
    res.status(422).json({
      message: mongooseErrorHandler(err as Error),
    });
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    const profile = await Driver.find();

    res.json({
      message: "Profile deleted",
      profile,
    });
  } catch (err) {
    res.status(422).json({
      message: mongooseErrorHandler(err as Error),
    });
  }
};

export const editProfile = async (req: Request, res: Response) => {
  try {
    const driver = await Driver.findById(req.params.id);
    (driver.firstName = req.body.firstName),
      (driver.lastName = req.body.lastName),
      (driver.email = req.body.email),
      (driver.phoneNumber = req.body.phoneNumber),
      (driver.licenseNum = req.body.licenseNum),
      (driver.licenseType = req.body.licenseType),
      (driver.typeValidU = req.body.typeValidU),
      (driver.codeNum = req.body.codeNum),
      (driver.codeNumValidU = req.body.codeNumValidU),
      (driver.driverCardNum = req.body.driverCardNum),
      (driver.driverCardNumValidU = req.body.driverCardNumValidU),
      await driver.save();

    res.json({
      message: "Profile data changed",
      driver,
    });
  } catch (error) {
    res.status(422).json({
      message: mongooseErrorHandler(error as Error),
    });
  }
};
