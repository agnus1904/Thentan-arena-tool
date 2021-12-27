import React from 'react';
import {IHero} from "../../../models";
import styles from "../../../styles/pages/home.module.scss";
import {Button, Card, Col, Image, Row, Typography} from "antd";
import calculatorHero from "../../../assets/utils/calculator";
import heroConstant from "../../../assets/constants/hero";

const { Meta } = Card;
const { Title, Text } = Typography;

interface HeroItemProps {
  hero: IHero,
  price: {
    WBNB: number|undefined,
    THC: number|undefined
  } | null
}

const percents =  [30, 40, 50, 60, 70, 80];

const HeroItem: React.FC<HeroItemProps> = (props)=>{

  const { hero, price } = props

  const calculateHeroPrice = React.useCallback(()=>{
    return calculatorHero.price(hero)*(price?.WBNB|| 0)
  },[hero, price?.WBNB])

  const calculateTotalUSD = React.useCallback((_percent: number)=>{
    const totalUSD = calculatorHero.THCReward(hero, _percent)*(price?.THC||0);
    return totalUSD-calculateHeroPrice();
  },[calculateHeroPrice, hero, price?.THC])

  const percentRewardComponent = React.useMemo(()=>{
    return (
      percents.map(percent=>(
        <Col span={4} key={percent} className={styles['table-item']}>
          <Title className={ calculateTotalUSD(percent)>=0 ? 'color-green': 'color-red'} level={5}>
            {percent}%</Title>
          <Text className={ calculateTotalUSD(percent)>=0 ? 'color-green': 'color-red'}>
            {calculateTotalUSD(percent).toFixed(2)}</Text>
        </Col>
      ))
    )
  },[calculateTotalUSD])

  const rarityComponent = React.useMemo(()=>{
    return (
      <Title level={3} style={{marginTop: 0, marginLeft: 20}}
             className={heroConstant.RarityColor[hero.heroRarity]}>
        {heroConstant.RarityName[hero.heroRarity]}
      </Title>
    )
  },[hero.heroRarity])

  return (
    <Card
      className={styles.card}
      hoverable
      cover={(
        <Row >
          <Col span={6}>
            <Image
              alt={hero['name']}
              height={200}
              width={150}
              className={styles.image}
              preview={false}
              src={process.env.assetsDomain+hero['imageAvatar']} />
          </Col>

          <Col span={18} style={{display: 'flex', width: '100%',
            padding: '20px 0',
            flexDirection: 'column', alignItems:'center'}}>
            <div style={{display: 'flex'}}>
              <Title level={3} >
                {hero['name']}
              </Title>
              {rarityComponent}
            </div>
            <Title level={3} style={{color: '#ff8700'}}>
              {calculatorHero.price(hero).toFixed(2)} WBNB
            </Title>
            <Title level={3} style={{marginTop: 0, color: '#09d509'}}>
              {calculateHeroPrice().toFixed(2)} USD
            </Title>
          </Col>
        </Row>
      )}
    >
      <Meta title={
        (<Title level={4} className={'color-text'}>{hero['refId']}</Title>)} description={(
        <>
          <Row>
            <Col span={16}>
              <Title level={4} >
                <Row >
                  <Col span={16}>Available</Col>
                  <Col span={8} className={'color-text'}>{calculatorHero.availableBattle(hero)}</Col>
                </Row>
                <Row>
                  <Col span={16}>Total</Col>
                  <Col span={8} className={'color-text'}>{hero.battleCapMax}</Col>
                </Row>
              </Title>
            </Col>
            <Col span={8}>
              <a target="_blank" rel="noreferrer"
                 href={process.env.marketplaceDomain + 'item/' + hero['refId']}>
                <Button type={'primary'} size={'large'}>
                  Buy Now
                </Button>
              </a>
            </Col>
          </Row>
          <Title level={4}>Remaining days:
            <span className={'color-text'}>&nbsp;
              {calculatorHero.totalBattleDay(hero)} days
            </span>
          </Title>
          <Title level={4} style={{marginTop: 0}}>Win rate & resources:
            <span className={'color-text'}> $</span></Title>
          <Row className={styles['table']}>
            {percentRewardComponent}
          </Row>
        </>
      )} />
    </Card>
  )
}

export default HeroItem;
