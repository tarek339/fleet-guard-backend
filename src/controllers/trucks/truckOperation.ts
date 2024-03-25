import { differenceInDays } from "date-fns";
import { Company } from "../../models/company";
import { ICompany, IVehicle } from "../../types/properties";
import dayjs from "dayjs";
import { ICompanyTruck } from "../../types/interfaces";
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

      const companyTrucks: ICompanyTruck[] = [];

      if (HUDays < 90 || SPDays < 90) {
        const truckToAdd = {
          truck: {
            companyId: company?._id,
            company: company?.company,
            email: company?.email,
            truckId: truck.companyId,
            indicator: truck.indicator,
            nextHU: dayjs(truck.nextHU).format("DD.MM.YYYY"),
            nextSP: dayjs(truck.nextSP).format("DD.MM.YYYY"),
          },
        };

        companyTrucks.push(truckToAdd as ICompanyTruck);

        const existingTrucks = companyTrucks.find(
          (compTr) => compTr.truck.truckId === truckToAdd.truck.truckId
        );

        if (existingTrucks) {
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
            to: existingTrucks?.truck.email,
            subject: `Info Docu Guard Trucks`,
            html: `
          <p>${existingTrucks?.truck.company}</p>
          <p>${existingTrucks?.truck.indicator}</p>
          <p>Next main inspection is on ${existingTrucks?.truck.nextHU}</p>
          <p>Next saftey inspection is on ${existingTrucks?.truck.nextSP}</p>
          `,
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};
