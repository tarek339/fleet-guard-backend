import { differenceInDays } from "date-fns";
import { Company } from "../../models/company";
import { Driver } from "../../models/driver";
import { ICompany, IDriver } from "../../types/properties";
import dayjs from "dayjs";
const nodemailer = require("nodemailer");

export const loopDrivers = async () => {
  try {
    const drivers: IDriver[] = await Driver.find();

    drivers.forEach(async (driver: IDriver, index) => {
      const company: ICompany | null = await Company.findById(driver.companyId);

      const presentDate = new Date();
      const expireDayType = driver.typeValidU;
      const expireDayCodeNumber = driver.codeNumValidU;
      const expireDaydriverCardNum = driver.driverCardNumValidU;

      const typeDays = differenceInDays(new Date(expireDayType), presentDate);
      const codeNumDays = differenceInDays(
        new Date(expireDayCodeNumber),
        presentDate
      );
      const cardNumDays = differenceInDays(
        new Date(expireDaydriverCardNum),
        presentDate
      );

      if (typeDays < 90 || codeNumDays < 90 || cardNumDays < 90) {
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
          subject: `Info Docu Guard Drivers`,
          html: `
          <p>${company?.company}</p>
          <p>${driver.firstName} ${driver.lastName}</p>
          <p>Driver's license type expires on ${dayjs(driver.typeValidU).format(
            "DD.MM.YYYY"
          )}</p>
          <p>Code number expires on ${dayjs(driver.codeNumValidU).format(
            "DD.MM.YYYY"
          )}</p>
          <p>Dirver's card number expires on ${dayjs(
            driver.driverCardNumValidU
          ).format("DD.MM.YYYY")}</p>
          `,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
