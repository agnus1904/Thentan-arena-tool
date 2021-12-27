import type {NextPage} from 'next'
import React from "react";
import styles from '../styles/pages/home.module.scss'
import heroApi from '../api-client/heroApi';
import {Button, Col, Row, Typography} from 'antd';
import HeroItem from "../components/common/HeroItem";
import coinApi from "../api-client/coinApi";
import Head from 'next/head'
import {IHero, IHeroFilter, IPrice} from "../models";

const { Title } = Typography;

const Home: NextPage = () => {
  const [heroes, setHeroes] = React.useState<IHero[]>([])
  const [price, setPrice] =
    React.useState< null | IPrice>(null)
  const [filter, setFilter] = React.useState<IHeroFilter>({
    sort: 'Latest',
    batPercentMin: 0,
    heroRarity: 0,
    from: 0,
    size: 10000
  })

  const recallHeroes = React.useCallback(async () => {
    const response = await heroApi.getAll(filter);
    if(response.error || !response.data) return;
    setHeroes(response.data);
  }, [filter])


  const getPrice = React.useCallback(async ()=>{
    setHeroes([]);
    const price = await coinApi.getPrice();
    if(price.error || !price.data){
      setPrice(null);
      return;
    }
    setPrice({
      WBNB: price.data.WBNB,
      THC: price.data.THC
    })
  },[])

  React.useEffect(()=>{
    if(price) recallHeroes()
  },[price, recallHeroes])

  React.useEffect(() => {
    getPrice();
  }, [ getPrice, recallHeroes])


  const filterHero = (hero: any): boolean => {
    return true
  }

  const heroListComponent = React.useMemo(() => (
    price && heroes.map((_hero) => filterHero(_hero) ? (
        <Col key={_hero['refId']} lg={8} md={12} sm={24}
             style={{display: 'flex', justifyContent: 'center', padding: 20}}>
          <HeroItem hero={_hero} price={price}/>
        </Col>
      ) : <></>
    )
  ), [heroes, price])

  return (
    <>
      <Head>
        <title>Thetan Arena Tool</title>
        <link rel='icon' href={'/favicon.png'}/>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles['home-container']}>
        <Row>
          <Col span={12}>
            <Button type={'primary'} onClick={getPrice}>Recall</Button>
          </Col>
        </Row>
        {heroes.length===0 && (
          <Row className={styles.loading}>
            <Title>...Loading</Title>
          </Row>
        )}
        <Row className={styles['hero-list']}>
          {heroListComponent}
        </Row>
      </div>
    </>

  )
}

export default Home
