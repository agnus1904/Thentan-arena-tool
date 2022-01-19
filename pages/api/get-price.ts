// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from "axios";
import NodeCache from 'node-cache';

type Res = {
  WBNB: number,
  THC: number,
  THG: number
} | {
  message: string
}

const myCache = new NodeCache;

const url= 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=thetan-arena%2Cwbnb%2Cthetan-coin&order=market_cap_desc&per_page=100&page=1&sparkline=false';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Res>
) {

  const oldCache: {
    price :Res,
    time: number
  } | undefined = myCache.get( "price" );
  const newDay = new Date();
  const newTime = newDay.getTime();

  if (oldCache && (newTime - oldCache.time) < 4000){
    res.status(200).json(oldCache.price);
    return;
  }

  try {
    const response = await axios.get(url);
    const WBNBPrice: number = response.data[2]['current_price'];
    const THCPrice: number = response.data[1]['current_price'];
    const THGPrice: number = response.data[0]['current_price']
    const price = {
      WBNB: WBNBPrice,
      THC: THCPrice,
      THG: THGPrice
    }
    const oldDay = new Date();
    const oldTime = oldDay.getTime();
    myCache.set("price", {
      price,
      time: oldTime
    });
    res.status(200).json(price);
  }catch{
    res.status(400).json({
      message: 'Bad Request'
    });
  }
}
