import type {NextPage} from 'next'
import React from "react";
import styles from '../styles/pages/home.module.scss'
import heroApi from '../api-client/heroApi';
import {Button, Col, Row, Typography, Checkbox, Image, Radio, RadioChangeEvent} from 'antd';
import HeroItem from "../components/common/HeroItem";
import coinApi from "../api-client/coinApi";
import Head from 'next/head'
import {IHero, IHeroFilter, IPrice} from "../models";
import calculatorHero from "../assets/utils/calculator";
import { Pagination } from 'antd';
import {CheckboxValueType} from "antd/es/checkbox/Group";
import axios from "axios";
import priceConstant from "../assets/constants/price";

const {Title} = Typography;

const Home: NextPage = () => {
  const [heroes, setHeroes] = React.useState<IHero[]>([])
  const [heroesFilter, setHeroesFilter] = React.useState<IHero[]>([]);
  const [price, setPrice] =
    React.useState<null | IPrice>(null)
  const [filter] = React.useState<IHeroFilter>({
    sort: 'Latest',
    batPercentMin: 0,
    heroRarity: [0,1,2],
    from: 0,
    size: 100
  })

  const [filterLocal, setFilterLocal] = React.useState<{
    heroRarity: CheckboxValueType[],
    profitLowerPercent: number
  }>({
    heroRarity: [0,1,2],
    profitLowerPercent: 70
  })

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 6
  })

  //fetch Heroes
  const recallHeroes = React.useCallback(async () => {
    const response = await heroApi.getAll(filter);
    if (response.error || !response.data) return;
    setHeroes(response.data);
  }, [filter])

  //fetch price
  const getPrice = React.useCallback(async () => {
    setHeroesFilter([]);
    const response = await axios.get('/api/auto-request');
    console.log(response.data);
    const newPrice = await coinApi.getPrice();
    if (newPrice.error || !newPrice.data) {
      setPrice(null);
      return;
    }
    setPrice({
      WBNB: newPrice.data.WBNB,
      THC: newPrice.data.THC,
      THG: newPrice.data.THG
    })
  }, [])

  //filter heroes after get heroes
  //filter again after filterLocal change
  React.useEffect(()=>{
    if(heroes.length > 0){
      const filterHeroes = heroes.filter((_hero)=>{
        const isInRarities = filterLocal.heroRarity.includes(_hero.heroRarity);
        const profit =
          (calculatorHero.THCReward(_hero, filterLocal.profitLowerPercent)* (price?.THC||0))
          - (calculatorHero.price(_hero)*(price?.WBNB||0));
        return (isInRarities && (profit>0));
      })
      setHeroesFilter(filterHeroes);
    }
  },[filterLocal.heroRarity, filterLocal.profitLowerPercent, heroes, price?.THC, price?.WBNB])

  //get heroes after change price
  React.useEffect(() => {
    if (price) recallHeroes()
  }, [price, recallHeroes])

  // getPrice after load
  React.useEffect(() => {
    getPrice();
  }, [getPrice])


  const paginationFilter = React.useCallback((index: number): boolean => {
    return (
      index >= pagination.pageIndex*pagination.pageSize &&
      index <= pagination.pageIndex*pagination.pageSize+5
    )
  },[pagination.pageIndex, pagination.pageSize])

  const onPaginationChange = (pageNumber: number) =>{
    setPagination({
      ...pagination,
      pageIndex: pageNumber-1
    })
  }

  const handleRarityChange = (checkedValues:  CheckboxValueType[])=>{
    setFilterLocal(rev=> ({
      ...rev,
      heroRarity: checkedValues,
    }))
  }

  const handleProfitChange = (e:  RadioChangeEvent)=>{
    setFilterLocal(rev=>({
      ...rev,
      profitLowerPercent: e.target.value
    }))
  }

  const heroListComponent = React.useMemo(() => (
    price && heroesFilter.map((_hero, index) =>
      paginationFilter(index) ?
      (<Col key={_hero.refId} lg={8} md={12} sm={24}
           style={{display: 'flex', justifyContent: 'center',
             width: '100%',padding: 20}}>
        <HeroItem hero={_hero} price={price}/>
      </Col>) : <React.Fragment key={_hero.refId} />
    )
  ), [heroesFilter, paginationFilter, price])

  return (
    <>
      <Head>
        <title>Thetan Arena Tool</title>
        <link rel='icon' href={'/favicon.png'}/>
        <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
      </Head>
      <div className={styles['home-container']}>
        <div className={styles['filter-box']}>
          <Row style={{width: '100%', maxWidth: 1400}}>
            <Col md={1} sm={0} />
            <Col md={3} sm={8} xs={8} className={styles['recall-box']}>
              <Button type={'primary'} onClick={getPrice}>Recall</Button>
            </Col>
            <Col md={8} sm={16} xs={16} style={{display: 'flex',
              flexDirection: 'column'}}>
              <Title level={4}>Hero rarity</Title>
              <Checkbox.Group
                options={[
                  { label: 'Common', value: 0 },
                  { label: 'Epic', value: 1 },
                  { label: 'Legendary', value: 2 }]}
                defaultValue={[0,1]}
                onChange={handleRarityChange} />
            </Col>
            <Col md={0} sm={2} xs={1}/>
            <Col md={12} sm={20} xs={22}
                 style={{
                   marginTop: 10, display: 'flex',
                   flexDirection: 'column'}}>
              <Title level={4}>Positive profit at</Title>
              <Radio.Group onChange={handleProfitChange}
                           value={filterLocal.profitLowerPercent}>
                <Radio value={30}>30%</Radio>
                <Radio value={40}>40%</Radio>
                <Radio value={50}>50%</Radio>
                <Radio value={60}>60%</Radio>
                <Radio value={70}>70%</Radio>
                <Radio value={80}>80%</Radio>
              </Radio.Group>
            </Col>
          </Row>
        </div>
        <Row>
          <Col span={6}/>
          <Col span={12} className={styles['price-box']} >
            <Row style={{width: '100%'}}>
              <Col span={8} className={styles['price-item']}>
                <Image
                  src={priceConstant.image.THC}
                  alt={'THC Image'} width={20} preview={false}
                />&nbsp;&nbsp;{price?.THC}&nbsp;<span style={{color: '#09d509'}}>$</span>
              </Col>
              <Col span={8} className={styles['price-item']}>
                <Image
                  src={priceConstant.image.THG}
                  alt={'THG Image'} width={20} preview={false}
                />&nbsp;&nbsp;{price?.THG}&nbsp;<span style={{color: '#09d509'}}>$</span>
              </Col>
              <Col span={8} className={styles['price-item']}>
                <Image
                  src={priceConstant.image.WBNB}
                  alt={'WBNB Image'} width={20} preview={false}
                />&nbsp;&nbsp;{price?.WBNB}&nbsp;<span style={{color: '#09d509'}}>$</span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={24} className={styles['pagination-box']}>
            {heroesFilter.length>0? (
              <Pagination
                pageSize={6}
                defaultCurrent={1}
                onChange={onPaginationChange}
                total={heroesFilter.length}
              />) : (
              <Pagination
                pageSize={6}
                defaultCurrent={1}
                onChange={onPaginationChange}
                total={6}
              />)}
          </Col>
        </Row>
        {heroesFilter.length === 0 && (
          <Row className={styles.loading}>
            <Title>...Loading</Title>
          </Row>
        )}
        <div className={styles['hero-list']}>
          <Row style={{width: '100%', maxWidth: 1400}}>
            {heroListComponent}
          </Row>
        </div>

      </div>
    </>
  )
}

export default Home
