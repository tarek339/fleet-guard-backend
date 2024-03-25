import { differenceInDays } from "date-fns";
import { Company } from "../../models/company";
import { Driver } from "../../models/driver";
import { ICompany, IDriver } from "../../types/properties";
import { ICompanyDrivers } from "../../types/interfaces";
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

      const companyDrivers: ICompanyDrivers[] = [];

      if (typeDays < 90 || codeNumDays < 90 || cardNumDays < 90) {
        const driverToAdd = {
          driver: {
            companyId: company?._id,
            company: company?.company,
            email: company?.email,
            driverId: driver.companyId,
            firstName: driver.firstName,
            lastName: driver.lastName,
            typeValidU: dayjs(driver.typeValidU).format("DD.MM.YYYY"),
            codeNumVU: dayjs(driver.codeNumValidU).format("DD.MM.YYYY"),
            cardNumVU: dayjs(driver.driverCardNumValidU).format("DD.MM.YYYY"),
          },
        };

        companyDrivers.push(driverToAdd as ICompanyDrivers);

        const existingDriver = companyDrivers.find(
          (compDr) => compDr.driver.driverId === driverToAdd.driver.driverId
        );

        if (existingDriver) {
          const transport = nodemailer.createTransport({
            service: "gmail",
            port: false,
            secure: true,
            auth: {
              user: "tarekjassine@gmail.com",
              pass: "wonoytjxbqgxhjtm",
            },
          });
          await transport.sendMail({
            from: "tarekjassine@gmail.com",
            to: existingDriver?.driver.email,
            subject: `Info Docu Guard`,
            html: `
          <p>${existingDriver?.driver.company}</p>
          <p>${existingDriver?.driver.firstName} ${existingDriver?.driver.lastName}</p>
          <p>Driver's license type expires on ${existingDriver?.driver.typeValidU}</p>
          <p>Code number expires on ${existingDriver?.driver.codeNumVU}</p>
          <p>Dirver's card number expires on ${existingDriver?.driver.cardNumVU}</p>
          `,
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};
