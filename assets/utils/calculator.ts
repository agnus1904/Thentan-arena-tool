import heroConstant from "../constants/hero";
import {IHero} from "../../models";


const calculatorHero = {
  price: (hero: any)=>{
    return hero['systemCurrency'].value/(Math.pow(10,hero['systemCurrency'].decimals));
  },
  totalBattleDay: (hero: any)=>{
    return (hero['battleCap'])/heroConstant.DailyBattle[hero['heroRarity']];
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
