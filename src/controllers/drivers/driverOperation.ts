import { differenceInDays } from "date-fns";
import { Driver } from "../../models/driver";
import { ICompany, IDriver } from "../../types/properties";
import dayjs from "dayjs";
import { ICompaniesDrivers, IDriversProps } from "../../types/interfaces";
const nodemailer = require("nodemailer");

let companies: ICompaniesDrivers = {};

export const loopDrivers = async () => {
  try {
    const drivers: IDriver[] = await Driver.find().populate("companyId");

    drivers.forEach(async (driver: IDriver, index) => {
      const company: ICompany = driver.companyId as unknown as ICompany;

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

      if (
        typeDays === 90 ||
        codeNumDays === 90 ||
        cardNumDays === 90 ||
        typeDays === 30 ||
        codeNumDays === 30 ||
        cardNumDays === 30
      ) {
        const driverToAdd = {
          company: company?.company,
          email: company?.email,
          firstName: driver.firstName,
          lastName: driver.lastName,
          licenseType: driver.licenseType,
          typeValidU: driver.typeValidU,
          codeNumValidU: driver.codeNumValidU,
          driverCardNumValidU: driver.driverCardNumValidU,
        };

        if (company._id in companies) {
          companies[company._id].push(driverToAdd);
        } else {
          companies[company._id] = [driverToAdd];
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const pushDriverEmail = async () => {
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
    const filteredDrivers = companies[key];

    await transport.sendMail({
      from: process.env.GOOGLE_EMAIL,
      to: filteredDrivers[0].email,
      subject: `Info Docu Guard Trailer`,
      html: `
            <p>${filteredDrivers[0].company}</p>
            ${filteredDrivers.map((driver: IDriversProps) => {
              return `
              <p>${driver.firstName} ${driver.lastName}</p>
            <p>License type ${driver.licenseType} expires on ${dayjs(
                driver.typeValidU
              ).format("MM.YYYY")}</p>
            <p>The code number expires on ${dayjs(driver.codeNumValidU).format(
              "MM.YYYY"
            )}</p>
            <p>The driver's card expires on ${dayjs(
              driver.driverCardNumValidU
            ).format("MM.YYYY")}</p>
              `;
            })}
            `,
    });
  }
};
