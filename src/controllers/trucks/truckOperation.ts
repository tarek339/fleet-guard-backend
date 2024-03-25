import { differenceInDays } from "date-fns";
import { Company } from "../../models/company";
import { ICompany, IVehicle } from "../../types/properties";
import dayjs from "dayjs";
import { Truck } from "../../models/truck";
const nodemailer = require("nodemailer");

export const loopTrucks = async () => {
  try {
    const trucks: IVehicle[] = await Truck.find();
    trucks.forEach(async (truck: IVehicle) => {
      const company: ICompany | null = await Company.findById(truck.companyId);

      const presentDate = new Date();
      const expireHU = truck.nextHU;
      const expireSP = truck.nextSP;

      const HUDays = differenceInDays(new Date(expireHU), presentDate);
      const SPDays = differenceInDays(new Date(expireSP), presentDate);

      if (HUDays < 90 || SPDays < 90) {
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
          to: company?.email,
          subject: `Info Docu Guard Trucks`,
          html: `
          <p>${company?.company}</p>
          <p>${truck.indicator}</p>
          <p>Next main inspection is on ${dayjs(truck.nextHU).format(
            "MM.YYYY"
          )}</p>
          <p>Next saftey inspection is on ${dayjs(truck.nextSP).format(
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
