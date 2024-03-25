import { Request, Response } from "express";
import { Error, mongooseErrorHandler } from "../../types/interfaces";
import { Trailer } from "../../models/trailer";

export const registerTrailer = async (req: Request, res: Response) => {
  try {
    const trailer = new Trailer({
      companyId: req.body.companyId,
      indicator: req.body.indicator,
      brand: req.body.brand,
      type: req.body.type,
      weight: req.body.weight,
      nextHU: req.body.nextHU,
      nextSP: req.body.nextSP,
    });
    await trailer.save();

    res.json({
      message: "Trailer profile created",
      company: {
        _id: trailer._id,
        indicator: trailer.indicator,
        brand: trailer.brand,
        type: trailer.type,
        weight: trailer.weight,
        nextHU: trailer.nextHU,
        nextSP: trailer.nextSP,
      },
    });
  } catch (err) {
    res.status(422).json({
      message: mongooseErrorHandler(err as Error),
    });
  }
};

export const fetchTrailers = async (req: Request, res: Response) => {
  try {
    const trailers = await Trailer.find();

    res.json({ trailers });
  } catch (err) {
    res.status(422).json({
      message: mongooseErrorHandler(err as Error),
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const profile = await Trailer.findById(req.params.id);
    res.json(profile);
  } catch (err) {
    res.status(422).json({
      message: mongooseErrorHandler(err as Error),
    });
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    await Trailer.findByIdAndDelete(req.params.id);
    const profile = await Trailer.find();

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
    const trailer = await Trailer.findById(req.params.id);
    (trailer.indicator = req.body.indicator),
      (trailer.brand = req.body.brand),
      (trailer.type = req.body.type),
      (trailer.weight = req.body.weight),
      (trailer.nextHU = req.body.nextHU),
      (trailer.nextSP = req.body.nextSP),
      await trailer.save();

    res.json({
      message: "Profile data changed",
      trailer,
    });
  } catch (error) {
    res.status(422).json({
      message: mongooseErrorHandler(error as Error),
    });
  }
};
