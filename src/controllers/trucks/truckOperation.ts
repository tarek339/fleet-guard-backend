import { differenceInDays } from "date-fns";
import { ICompany, IVehicle } from "../../types/properties";
import dayjs from "dayjs";
import { Truck } from "../../models/truck";
const nodemailer = require("nodemailer");

let companies: any = {};

export const loopTrucks = async () => {
  try {
    const trucks: IVehicle[] = await Truck.find().populate("companyId");

    trucks.forEach(async (truck: IVehicle) => {
      const company: ICompany = truck.companyId as unknown as ICompany;

      const presentDate = new Date();
      const expireHU = truck.nextHU;
      const expireSP = truck.nextSP;
      const expireTacho = truck.nextTachograph;

      const HUDays = differenceInDays(new Date(expireHU), presentDate);
      const SPDays = differenceInDays(new Date(expireSP), presentDate);
      const TachoDays = differenceInDays(new Date(expireTacho!), presentDate);

      if (HUDays < 90 || SPDays < 90 || TachoDays < 90) {
        const truckToAdd = {
          company: company?.company,
          email: company?.email,
          indicator: truck.indicator,
          nextHU: truck.nextHU,
          nextSP: truck.nextSP,
          nextTacho: truck.nextTachograph,
        };

        if (company._id in companies) {
          companies[company._id].push(truckToAdd);
        } else {
          companies[company._id] = [truckToAdd];
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const pushTruckEmail = async () => {
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
    const filteredTrucks = companies[key];

    await transport.sendMail({
      from: process.env.GOOGLE_EMAIL,
      to: filteredTrucks[0].email,
      subject: `Info Docu Guard Trailer`,
      html: `
            <p>${filteredTrucks[0].company}</p>
  
            ${filteredTrucks.map((truck: IVehicle) => {
              return `
              <p>${truck.indicator}</p>
            <p>Next main inspection is on ${dayjs(truck.nextHU).format(
              "MM.YYYY"
            )}</p>
            <p>Next saftey inspection is on ${dayjs(truck.nextSP).format(
              "MM.YYYY"
            )}</p>
            <p>Next tachograph inspection is on ${dayjs(
              truck.nextTachograph
            ).format("MM.YYYY")}</p>
              `;
            })}
            `,
    });
  }
};
