import type {NextPage} from 'next'
import React from "react";
import styles from '../styles/pages/home.module.scss'
import heroApi from '../api-client/heroApi';
import {Col, Pagination, Row, Typography} from 'antd';
import HeroItem from "../components/common/HeroItem";
import coinApi from "../api-client/coinApi";
import Head from 'next/head';
import {IHero, IHeroFilter, IPrice} from "../models";
import calculatorHero from "../assets/utils/calculator";
import {CheckboxValueType} from "antd/es/checkbox/Group";
import Filter from "../components/pages/Home/Filter/Filter";
import Price from "../components/pages/Home/Price/Price";


const Home: NextPage = () => {
  const [heroes, setHeroes] = React.useState<IHero[]>([])
  const [heroesFilter, setHeroesFilter] = React.useState<IHero[]>([]);
  const [price, setPrice] =
    React.useState<null | IPrice>(null)
  const [filter, setFilter] = React.useState<IHeroFilter>({
    sort: 'Latest',
    batPercentMin: 0,
    heroRarity: [0, 1, 2],
    from: 0,
    size: 100
  })
  const [isFetching, setIsFetching] = React.useState(false);

  const [filterLocal, setFilterLocal] = React.useState<{
    profitLowerPercent: number,
    battleDaysRemaining: number
  }>({
    profitLowerPercent: 50,
    battleDaysRemaining: 50
  })

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 6
  })

  //fetch Heroes
  const recallHeroes = React.useCallback(async () => {
    if(isFetching) return;
    setIsFetching(true);
    const response = await heroApi.getAll(filter);
    if (response.error || !response.data) return;
    setHeroes(response.data);
  }, [filter, isFetching])

  //fetch price
  const getPrice = React.useCallback(async () => {
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
  React.useEffect(() => {
    if (heroes.length > 0) {
      const filterHeroes = heroes.filter((_hero) => {
        const profit = calculatorHero.profit(_hero, filterLocal, price);
        const battleDays = calculatorHero.totalBattleDay(_hero);
        return profit > 0 && battleDays < filterLocal.battleDaysRemaining;
      })
      setHeroesFilter(filterHeroes);
      setIsFetching(false);
    }
  }, [filterLocal, filterLocal.profitLowerPercent, heroes, price])

  //get heroes after change price
  React.useEffect(() => {
    if (price) recallHeroes()
  }, [price, recallHeroes])

  // getPrice after load
  React.useEffect(() => {
    setIsFetching(true)
    getPrice();
  }, [getPrice])

  const paginationFilter = React.useCallback((index: number): boolean => {
    return (
      index >= pagination.pageIndex * pagination.pageSize &&
      index <= pagination.pageIndex * pagination.pageSize + 5
    )
  }, [pagination.pageIndex, pagination.pageSize])

  const onPaginationChange = (pageNumber: number) => {
    setPagination({
      ...pagination,
      pageIndex: pageNumber - 1
    })
  }

  const handleRarityChange = (checkedValues: CheckboxValueType[]) => {
    const values: number[] = checkedValues.map(
      value=>JSON.parse(JSON.stringify(value))
    );
    setFilter(rev => ({
      ...rev,
      heroRarity: values,
    }))
  }

  const filterRef = React.useRef<any>(null);

  const handleProfitChange = (value: number) => {
    if (filterRef.current) {
      clearTimeout(filterRef.current)
    }
    filterRef.current = setTimeout(() => {
      setFilterLocal(rev => ({
        ...rev,
        profitLowerPercent: value
      }))
    }, 2000)
  }

  const handleBattleDaysChange = (value: number) => {
    if (filterRef.current) {
      clearTimeout(filterRef.current)
    }
    filterRef.current = setTimeout(() => {
      setFilterLocal(rev => ({
        ...rev,
        battleDaysRemaining: value
      }))
    }, 2000)
  }

  const heroListComponent = React.useMemo(() => (
    price && heroesFilter.map((_hero, index) =>
      paginationFilter(index) ?
        (<Col key={_hero.refId} lg={8} md={12} sm={24}
              style={{
                display: 'flex', justifyContent: 'center',
                width: '100%', padding: 20
              }}>
          <HeroItem hero={_hero} price={price}/>
        </Col>)
        : <React.Fragment key={_hero.refId}/>
    )
  ), [heroesFilter, paginationFilter, price])

  console.log('fetching', isFetching);
  console.log('data', heroes.length);
  console.log('dataFilter', heroesFilter.length);
  return (
    <>
      <Head>
        <title>Thetan Arena Tool</title>
        <link rel='icon' href={'/favicon.png'}/>
        <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
      </Head>
      <div className={styles['home-container']}>

        <Filter
          getPrice={getPrice} filter={filter}
          filterLocal={filterLocal}
          isFetching={isFetching}
          handleRarityChange={handleRarityChange}
          handleProfitChange={handleProfitChange}
          handleBattleDaysChange={handleBattleDaysChange}
        />

        {/*price*/}
        <Row>
          <Col md={6} sm={4} xs={3}/>
          <Col md={12} sm={16} xs={18} className={styles['price-box']}>
            <Price price={price}/>
          </Col>
        </Row>

        {/*paging*/}
        <Row>
          <Col span={24} className={styles['pagination-box']}>
            {heroesFilter.length > 0 ? (
              <Pagination
                current={pagination.pageIndex + 1}
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
        {
          isFetching ? (
            <Row className={styles.loading}>
              <Typography.Title>...Loading</Typography.Title>
            </Row>
          ) : (heroesFilter.length === 0) && (
            <Row className={styles.loading}>
              <Typography.Title>No data</Typography.Title>
            </Row>
          )
        }
        <div className={styles['hero-list']}>
          <Row style={{width: '100%', maxWidth: 1400}}>
            {isFetching || heroListComponent}
          </Row>
        </div>
        {/*paging*/}
        <Row>
          <Col span={24} className={styles['pagination-box']}>
            {heroesFilter.length > 0 ? (
              <Pagination
                current={pagination.pageIndex + 1}
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
      </div>
    </>
  )
}

export default Home
