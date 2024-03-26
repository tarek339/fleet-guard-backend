import { differenceInDays } from "date-fns";
import { ICompany, IVehicle } from "../../types/properties";
import dayjs from "dayjs";
import { Trailer } from "../../models/trailer";
const nodemailer = require("nodemailer");

let companies: any = {};

export const loopTrailers = async () => {
  try {
    const trailers: IVehicle[] = await Trailer.find().populate("companyId");

    trailers.forEach((trailer: IVehicle) => {
      const company: ICompany = trailer.companyId as unknown as ICompany;

      const presentDate = new Date();
      const expireHU = trailer.nextHU;
      const expireSP = trailer.nextSP;

      const HUDays = differenceInDays(new Date(expireHU), presentDate);
      const SPDays = differenceInDays(new Date(expireSP), presentDate);

      if (HUDays < 90 || SPDays < 90) {
        const trailerToAdd = {
          company: company?.company,
          email: company?.email,
          indicator: trailer.indicator,
          nextHU: trailer.nextHU,
          nextSP: trailer.nextSP,
        };

        if (company._id in companies) {
          companies[company._id].push(trailerToAdd);
        } else {
          companies[company._id] = [trailerToAdd];
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const pushTrailerEmail = async () => {
  const transport = nodemailer.createTransport({
    service: process.env.GOOGLE_SERVICE,
    port: false,
    secure: true,
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_PASSWORD,
    },
  });

  for (let key of Object.keys(companies)) {
    const filteredTrailers = companies[key];

    await transport.sendMail({
      from: process.env.GOOGLE_EMAIL,
      to: filteredTrailers[0].email,
      subject: `Info Docu Guard Trailer`,
      html: `
            <p>${filteredTrailers[0].company}</p>
  
            ${filteredTrailers.map((trailer: IVehicle) => {
              return `
              <p>${trailer.indicator}</p>
            <p>Next main inspection is on ${dayjs(trailer.nextHU).format(
              "MM.YYYY"
            )}</p>
            <p>Next saftey inspection is on ${dayjs(trailer.nextSP).format(
              "MM.YYYY"
            )}</p>
              `;
            })}
            `,
    });
  }
};
