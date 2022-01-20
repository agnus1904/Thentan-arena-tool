import React from 'react';
import {IHero, IPrice} from "../../../models";
import styles from "./styles.module.scss";
import {Button, Card, Col, Image, Row, Typography} from "antd";
import calculatorHero from "../../../assets/utils/calculator";
import heroConstant from "../../../assets/constants/hero";
import {ShoppingCartOutlined} from "@ant-design/icons";

const { Meta } = Card;
const { Title, Text } = Typography;

interface HeroItemProps {
  hero: IHero,
  price: IPrice
}

const percents =  [30, 40, 50, 60, 70, 80];

const HeroItem: React.FC<HeroItemProps> = (props)=>{

  const { hero, price } = props

  const calculateHeroPrice = React.useCallback(()=>{
    return calculatorHero.price(hero)*price.WBNB
  },[hero, price.WBNB])

  const calculateTotalUSD = React.useCallback((_percent: number)=>{
    const totalUSD = calculatorHero.THCReward(hero, _percent)*price.THC;
    return totalUSD*0.96-calculateHeroPrice();
  },[calculateHeroPrice, hero, price.THC])

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
      <Title level={4} style={{marginTop: 0, marginLeft: 20}}
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
          <div className={styles['tool-tip']}>
            <Image alt={'text'} width={40} height={40}
              src={heroConstant.trophyClass[hero.trophyClass]}/>
            <Image alt={'text'} width={30} height={30}
                   src={heroConstant.level[hero.level]}/>
          </div>
          <Col span={8} className={styles['avatar-box']}>

            <Image
              alt={hero['name']}
              height={200}
              width={150}
              className={styles.image}
              preview={false}
              src={process.env.assetsDomain+hero['imageAvatar']} />
          </Col>

          <Col span={16} style={{display: 'flex', width: '100%',
            padding: '20px 0',
            flexDirection: 'column', alignItems:'center'}}>
            <div style={{display: 'flex'}}>
              <Title level={5} >
                {hero['name']}
              </Title>
              {rarityComponent}
            </div>
            <Title level={4} className={'color-orange'}>
              {calculatorHero.price(hero).toFixed(3)} WBNB
            </Title>
            <Title level={4} style={{marginTop: 0, color: '#09d509'}}>
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
            <Col span={18}>
              <Title level={4} >
                <Row >
                  <Col span={16}>Available</Col>
                  <Col span={8} className={'color-text'}>{hero.battleCap}</Col>
                </Row>
                <Row>
                  <Col span={16}>Total</Col>
                  <Col span={8} className={'color-text'}>{hero.battleCapMax}</Col>
                </Row>
              </Title>
            </Col>
            <Col span={6}>
              <a target="_blank" rel="noreferrer"
                 href={process.env.marketplaceDomain + 'item/' + hero['refId']}>
                <Button type={'primary'}
                        style={{
                          paddingTop: 10,
                          width: '100%',
                          height: '100%',
                          borderRadius: 5,
                        }}
                        size={'large'}>
                  <ShoppingCartOutlined style={{fontSize: 35}}/>
                </Button>
              </a>
            </Col>
          </Row>
          <Title level={4}>Remaining days:
            <span className={'color-text'}>&nbsp;
              {Math.ceil(calculatorHero.totalBattleDay(hero))} days
            </span>
          </Title>
          <Title level={4} style={{marginTop: 0}}>
            Win rate & profit:
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
