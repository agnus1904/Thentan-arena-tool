import thetanMarketAxios from "./axiosClient/thetanMarketAxios";
import {IHero} from "../models";
import {IResponse} from "../models/response";
import errorTransfer from "../assets/constants/error";

export interface filter{
  sort: string,
  batPercentMin: number,
  heroRarity: number[],
  from: number,
  size: number
}

const HeroApi = {
  getAll: async (filter: filter): Promise<IResponse<IHero[]>> =>{
    try{
      if(filter.heroRarity.length===0) return{
        error: false,
        data: []
      }
      const url = 'search' +
        '?sort='+filter.sort.toString()+
        '&batPercentMin='+filter.batPercentMin.toString()+
        '&heroRarity='+filter.heroRarity.join(',')+
        '&from='+filter.from.toString()+
        // '&heroTypeIds=9'+
        '&size='+filter.size.toString();
      const response = await thetanMarketAxios.get(url);
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
