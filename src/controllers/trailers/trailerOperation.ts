import { differenceInDays } from "date-fns";
import { Company } from "../../models/company";
import { ICompany, IVehicle } from "../../types/properties";
import dayjs from "dayjs";
import { Trailer } from "../../models/trailer";
const nodemailer = require("nodemailer");

export const loopTrailers = async () => {
  try {
    const trailers: IVehicle[] = await Trailer.find();
    trailers.forEach(async (trailer: IVehicle) => {
      const company: ICompany | null = await Company.findById(
        trailer.companyId
      );

      const presentDate = new Date();
      const expireHU = trailer.nextHU;
      const expireSP = trailer.nextSP;

      const HUDays = differenceInDays(new Date(expireHU), presentDate);
      const SPDays = differenceInDays(new Date(expireSP), presentDate);

      if (HUDays < 90 || SPDays < 90) {
        const transport = nodemailer.createTransport({
          service: process.env.GOOGLE_SERVICE,
          port: false,
          secure: true,
          auth: {
            user: process.env.GOOGLE_EMAIL,
            pass: process.env.GOOGLE_PASSWORD,
          },
        });
        await transport.sendMail({
          from: process.env.GOOGLE_EMAIL,
          to: company?.email,
          subject: `Info Docu Guard Trailer`,
          html: `
          <p>${company?.company}</p>
          <p>${trailer.indicator}</p>
          <p>Next main inspection is on ${dayjs(trailer.nextHU).format(
            "MM.YYYY"
          )}</p>
          <p>Next saftey inspection is on ${dayjs(trailer.nextSP).format(
            "MM.YYYY"
          )}</p>
          `,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
