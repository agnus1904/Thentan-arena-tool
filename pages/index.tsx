import type { NextPage } from 'next'
import React from "react";
import heroApi from '../api-client/heroApi';
import {Card, Col, Image, Row, Typography} from 'antd';

const { Meta } = Card;
const { Title } = Typography;

const heroRarity = [9.25, 12.5, 29.55];
const heroDailyBattle = [8, 10, 12];

const Home: NextPage = () => {
  const [heroes, setHeroes] = React.useState([])

  React.useEffect(()=>{
    heroApi.getAll({
      sort: 'Latest',
      batPercentMin: 0,
      heroRarity: 1,
      from: 0,
      size: 10000
    }).then((res)=>{
      setHeroes(res.data);
    }).catch((err)=>{
      console.log(err)
    })
  },[])


  const filterHero = (hero: any): boolean=>{
    return true
  }

  const calculatePrice = (system: any)=>{
    return system.value/(Math.pow(10,system.decimals));
  }

  const calculateTHCReward = (hero: any, percent: number)=>{
    return (heroRarity[hero['heroRarity']]*(hero['battleCapMax']-hero['battleCap'])) *percent/100;
  }

  const calculateTotalBattleDay = (hero: any)=>{
    return (hero['battleCapMax']-hero['battleCap'])/heroDailyBattle[hero['heroRarity']];
  }

  const percentRewardComponent = (hero: any)=>{
    const percents =  [30, 40, 50, 60, 70, 80];
    return percents.map(percent=>(
      <Col span={4} key={percent}>
        <Title level={5}>{percent}%</Title>
        <Title level={5}>{calculateTHCReward(hero, percent)}</Title>
      </Col>
    ))
  }

  const heroListComponent = React.useMemo(()=>(
    heroes.map((_hero)=> filterHero(_hero) ? (
      <Col span={8} style={{ display: 'flex', justifyContent:'center', padding: 20}}>
        <Card
          hoverable
          key={_hero['refId']}
          style={{ width: 400 }}
          cover={
            <Image
              alt={_hero['name']}
              height={150}
              width={150}
              preview={false}
              src={process.env.assetsDomain+_hero['imageFull']} />}
        >
          <Meta title={_hero['refId']} description={(
            <>
              <a target="_blank" href={process.env.marketplaceDomain + 'item/' + _hero['refId']} rel="noreferrer">
                {_hero['name']}
              </a>
              <Title level={2}>{calculatePrice(_hero['systemCurrency'])} WBNB</Title>
              <Title level={3}>
                {_hero['battleCapMax']-_hero['battleCap']}/{_hero['battleCapMax']}</Title>
              <Title level={3}>Remaining days: {calculateTotalBattleDay(_hero)}</Title>
              <Row>
                {percentRewardComponent(_hero)}
              </Row>
            </>
          )} />
        </Card>
      </Col>
      )  : <></>
    )
  ),[heroes])

  return (
    <div className={'home'}>
      <Row>
        {heroListComponent}
      </Row>
    </div>
  )
}

export default Home
