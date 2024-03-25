import { Request, Response } from "express";
import { Error, mongooseErrorHandler } from "../../types/interfaces";
import { Truck } from "../../models/truck";

export const registerTruck = async (req: Request, res: Response) => {
  try {
    const truck = new Truck({
      companyId: req.body.companyId,
      indicator: req.body.indicator,
      brand: req.body.brand,
      type: req.body.type,
      weight: req.body.weight,
      nextHU: req.body.nextHU,
      nextSP: req.body.nextSP,
      nextTachograph: req.body.nextTachograph,
    });
    await truck.save();

    res.json({
      message: "Truck profile created",
      truck: {
        _id: truck._id,
        indicator: truck.indicator,
        brand: truck.brand,
        type: truck.type,
        weight: truck.weight,
        nextHU: truck.nextHU,
        nextSP: truck.nextSP,
        nextTachograph: truck.nextTachograph,
      },
    });
  } catch (err) {
    res.status(422).json({
      message: mongooseErrorHandler(err as Error),
    });
  }
};

export const fetchTrucks = async (req: Request, res: Response) => {
  try {
    const trucks = await Truck.find();

    res.json({ trucks });
  } catch (err) {
    res.status(422).json({
      message: mongooseErrorHandler(err as Error),
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const profile = await Truck.findById(req.params.id);

    res.json(profile);
  } catch (err) {
    res.status(422).json({
      message: mongooseErrorHandler(err as Error),
    });
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    await Truck.findByIdAndDelete(req.params.id);
    const profile = await Truck.find();

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
    const truck = await Truck.findById(req.params.id);
    (truck.indicator = req.body.indicator),
      (truck.brand = req.body.brand),
      (truck.type = req.body.type),
      (truck.weight = req.body.weight),
      (truck.nextHU = req.body.nextHU),
      (truck.nextSP = req.body.nextSP),
      (truck.nextTachograph = req.body.nextTachograph),
      await truck.save();

    res.json({
      message: "Profile data changed",
      truck,
    });
  } catch (error) {
    res.status(422).json({
      message: mongooseErrorHandler(error as Error),
    });
  }
};
