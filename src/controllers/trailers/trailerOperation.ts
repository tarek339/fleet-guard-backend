import { differenceInDays } from "date-fns";
import { Company } from "../../models/company";
import { ICompany, IVehicle } from "../../types/properties";
import dayjs from "dayjs";
import { Trailer } from "../../models/trailer";
import { ICompanyTrailer } from "../../types/interfaces";
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

      const companyTrailers: ICompanyTrailer[] = [];

      if (HUDays < 90 || SPDays < 90) {
        const trailerToAdd = {
          trailer: {
            companyId: company?._id,
            company: company?.company,
            email: company?.email,
            trailerId: trailer.companyId,
            indicator: trailer.indicator,
            nextHU: dayjs(trailer.nextHU).format("DD.MM.YYYY"),
            nextSP: dayjs(trailer.nextSP).format("DD.MM.YYYY"),
          },
        };

        companyTrailers.push(trailerToAdd as ICompanyTrailer);

        const existingTrailers = companyTrailers.find((compTr) => compTr);

        if (existingTrailers) {
          const transport = nodemailer.createTransport({
            service: "gmail",
            port: false,
            secure: true,
            auth: {
              user: "tarekjassine@gmail.com",
              pass: process.env.GOOGLE_PASSWORD,
            },
          });
          await transport.sendMail({
            from: "tarekjassine@gmail.com",
            to: existingTrailers?.trailer.email,
            subject: `Info Docu Guard Trailer`,
            html: `
          <p>${existingTrailers?.trailer.company}</p>
          <p>${existingTrailers?.trailer.indicator}</p>
          <p>Next main inspection is on ${existingTrailers?.trailer.nextHU}</p>
          <p>Next saftey inspection is on ${existingTrailers?.trailer.nextSP}</p>
          `,
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};
