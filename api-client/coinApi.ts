import coinMarketCapAxios from "./axiosClient/coinMarketCapAxios";
import {IPrice} from "../models";
import {IResponse} from "../models/response";
import errorTransfer from "../assets/constants/error";


const coinApi = {
  getPrice: async (): Promise<IResponse<IPrice>> =>{
    try {
      const response = await coinMarketCapAxios.get(process.env.coinMarketCapEndpoint+'?slug=thetan-coin,wbnb');
      const WBNBPrice = response.data['7192']['quote']['USD']['price'];
      const THCPrice = response.data['15250']['quote']['USD']['price'];
      return {
        error: false,
        data: {
          WBNB: WBNBPrice,
          THC: THCPrice
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
