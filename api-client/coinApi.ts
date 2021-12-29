import {IPrice} from "../models";
import {IResponse} from "../models/response";
import errorTransfer from "../assets/constants/error";
import axios from "axios";


const coinApi = {
  getPrice: async (): Promise<IResponse<IPrice>> =>{
    try {
      const response = await axios.get('/api/get-price');
      return {
        error: false,
        data: {
          WBNB: response.data.WBNB,
          THC: response.data.THC,
          THG :response.data.THG
        }
      }
    } catch (err){
      return {
        error: true,
        message: errorTransfer.serverError
      };
    }
  },
}
export default coinApi
