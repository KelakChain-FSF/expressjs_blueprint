import { Response, Request } from "express";
import { ApiRes } from "../services/restapi/status";
export const HomePage = async (req: Request, res: Response) => {
  let data = {
    name: "Majid Ahmaditabar",
    linkedin: "https://www.linkedin.com/in/majahd/",
  };
  ApiRes(res, <RestApi.ResInterface>{
    status: 200,
    msg: undefined,
    data: data,
  });
};
