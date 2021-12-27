import thetanMarketAxios from "./axiosClient/thetanMarketAxios";
import {IHero} from "../models";
import {IException, IResponse} from "../models/response";
import errorTransfer from "../assets/constants/error";
import {AxiosResponse} from "axios";

export interface filter{
  sort: string,
  batPercentMin: number,
  heroRarity: number,
  from: number,
  size: number
}

const HeroApi = {
  getAll: async (filter: filter): Promise<IResponse<IHero[]>> =>{
    try{
      const response = await thetanMarketAxios.get(
        'search' +
        '?sort='+filter.sort.toString()+
        '&batPercentMin='+filter.batPercentMin.toString()+
        '&heroRarity='+filter.heroRarity.toString()+
        '&from='+filter.from.toString()+'&size=6');
        return {
          error: false,
          data: response.data
        };
    }catch (err: any){
      return {
        error: true,
        message: errorTransfer.serverError
      };
    }
  }
}



export default HeroApi;
