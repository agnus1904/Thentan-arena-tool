import thetanMarketAxios from "./axiosClient/thetanMarketAxios";

export interface filter{
  sort: string,
  batPercentMin: number,
  heroRarity: number,
  from: number,
  size: number
}

const HeroApi = {
  getAll(filter: filter){
    return thetanMarketAxios.get(
      'search' +
      '?sort='+filter.sort.toString()+
      '&batPercentMin='+filter.batPercentMin.toString()+
      '&heroRarity='+filter.heroRarity.toString()+
      '&from='+filter.from.toString()+'&size=20');
  }
}



export default HeroApi;
