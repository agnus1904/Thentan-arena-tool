import coinMarketCapAxios from "./axiosClient/coinMarketCapAxios";


const coinApi = {
  getPriceThetan: async (): Promise<number>=>{
    const response = await coinMarketCapAxios.get(process.env.coinMarketCapEndpoint+'?slug=thetan-coin');
    return response.data['15250']['quote']['USD']['price'];
  },
  getPriceWBNB: async (): Promise<number>=>{
    const response = await coinMarketCapAxios.get(process.env.coinMarketCapEndpoint+'?slug=wbnb');
    return response.data['7192']['quote']['USD']['price'];
  }
}
export default coinApi
