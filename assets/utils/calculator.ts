import heroConstant from "../constants/hero";


const calculatorHero = {
  price: (hero: any)=>{
    return hero['systemCurrency'].value/(Math.pow(10,hero['systemCurrency'].decimals));
  },
  availableBattle: (hero: any) =>{
    return hero['battleCapMax']-hero['battleCap']
  },
  totalBattleDay: (hero: any)=>{
    return (calculatorHero.availableBattle(hero))/heroConstant.DailyBattle[hero['heroRarity']];
  },
  THCReward: (hero: any, percent: number)=>{
    const index = hero['heroRarity'];
    const available = calculatorHero.availableBattle(hero)
    return (heroConstant.Rarity[index]*(available)) * percent / 100;
  }
}

const calculatePrice = (system: any)=>{
  return system.value/(Math.pow(10,system.decimals));
}

export default calculatorHero;
