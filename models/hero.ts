export interface IHero{
  battleCap: number;
  battleCapMax: number;
  created: Date;
  dmg: number;
  heroRarity: number;
  heroRole: number;
  heroTypeId: number;
  hp: number;
  id: string;
  imageAvatar: string;
  imageFull: string;
  lastModified: Date;
  level: number;
  marketType: number;
  name: string;
  ownerAddress: string;
  ownerId: string;
  price: number;
  refId: string;
  refType: number;
  skinId: number;
  skinName: string;
  skinRarity: number;
  status: number;
  systemCurrency:{
    type: number,
      name: string,
      value: number,
      decimals: number
  };
  tokenId: string;
  trophyClass: any;
}

export interface IHeroFilter{
  sort: string,
  batPercentMin: number,
  heroRarity: number[],
  from: number,
  size: number
}
