import type {NextPage} from 'next'
import React from "react";
import styles from '../styles/pages/home.module.scss'
import heroApi from '../api-client/heroApi';
import {Button, Col, Row, Typography} from 'antd';
import HeroItem from "../components/common/HeroItem";
import coinApi from "../api-client/coinApi";
import Head from 'next/head'

const { Title } = Typography;

const Home: NextPage = () => {
  const [heroes, setHeroes] = React.useState([])
  const [price, setPrice] =
    React.useState< null |{WBNB: number|undefined,THC: number|undefined}>(null)

  const recallHeroes = React.useCallback(() => {
    heroApi.getAll({
      sort: 'Latest',
      batPercentMin: 0,
      heroRarity: 1,
      from: 0,
      size: 10000
    }).then((res) => {
      setHeroes(res.data);
    }).catch((err) => {
      console.log(err)
    })
  }, [])

  const getPrice = React.useCallback(async ()=>{
    setHeroes([]);
    const THCPrice = await coinApi.getPriceThetan();
    const WBNBPrice = await coinApi.getPriceWBNB();
    setPrice({
      WBNB: WBNBPrice,
      THC: THCPrice
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
    heroes.map((_hero) => filterHero(_hero) ? (
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
