import heroConstant from "../constants/hero";
import {IHero, IPrice} from "../../models";

interface ILocalFilter {
  profitLowerPercent: number,
  battleDaysRemaining: number,
  pagination: {
    pageIndex: number,
    pageSize: number
  }
}

const calculatorHero = {
  profit: (hero: IHero, localFilter: ILocalFilter, price: IPrice | null)=>{
    if(price===null) return 0;
    const total = calculatorHero.THCReward(hero, localFilter.profitLowerPercent) * (price?.THC || 0);
    const heroPrice = calculatorHero.price(hero) * (price?.WBNB || 0);
    return total*0.96 - heroPrice;
  },
  price: (hero: IHero)=>{
    return hero.systemCurrency.value/(Math.pow(10,hero.systemCurrency.decimals));
  },
  totalBattleDay: (hero: IHero)=>{
    return (hero.battleCap)/heroConstant.DailyBattle[hero.heroRarity];
  },
  THCReward: (hero: IHero, percent: number)=>{
    const index = hero.heroRarity;
    const available = hero.battleCap;
    const rewardWin = (heroConstant.Rarity[index]*(available)) * percent / 100;
    const rewardLose = hero['battleCap'] * (100-percent) / 100;
    return rewardWin + rewardLose;
  }
}

export default calculatorHero;
