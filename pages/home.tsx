import type {NextPage} from 'next'
import React from "react";
import styles from '../styles/pages/home.module.scss'
import heroApi from '../api-client/heroApi';
import {Col, Pagination, Row, Typography} from 'antd';
import coinApi from "../api-client/coinApi";
import Head from 'next/head';
import {IHero, IPrice} from "../models";
import calculatorHero from "../assets/utils/calculator";
import Price from "../components/pages/Home/Price/Price";
import Filter from "../components/pages/Home/Filter/Filter";
import {CheckboxValueType} from "antd/es/checkbox/Group";
import HeroItem from "../components/common/HeroItem";


interface ILocalFilter {
  profitLowerPercent: number,
  battleDaysRemaining: number,
  pagination: {
    pageIndex: number,
    pageSize: number
  }
}

const Home: NextPage = () => {
  const [data, setData] = React.useState<{
    price: IPrice | null,
    filteredHeroes: IHero[] | null,
    total: number,
    isFetching: boolean
  }>({
    price: null,
    filteredHeroes: null,
    total: 0,
    isFetching: true,
  })

  const [networkFilter, setNetworkFilter] = React.useState({
    sort: 'Latest',
    batPercentMin: 0,
    heroRarity: [0, 1, 2],
    from: 0,
    size: 50
  })

  const [localFilter, setLocalFilter] = React.useState<ILocalFilter>({
    profitLowerPercent: 50,
    battleDaysRemaining: 50,
    pagination: {
      pageIndex: 0,
      pageSize: 6
    }
  })

  const heroesRef = React.useRef<IHero[] | null>(null);

  const paginationFilter = React.useCallback((index: number): boolean => {
    return (
      index >= localFilter.pagination.pageIndex * localFilter.pagination.pageSize &&
      index <= localFilter.pagination.pageIndex * localFilter.pagination.pageSize + 5
    )
  }, [localFilter.pagination.pageIndex, localFilter.pagination.pageSize])

  const filterHeroes = React.useCallback((heroes: IHero[], price: IPrice)=>{
    const total = heroes.filter((_hero) => {
      const profit = calculatorHero.profit(_hero, localFilter, price);
      const battleDays = calculatorHero.totalBattleDay(_hero);
      return (
        profit > 0 &&
        battleDays < localFilter.battleDaysRemaining
      )
    });
    const filtered = total.filter((_hero, index) => paginationFilter(index))
    return {
      total: total.length,
      filtered
    }
  },[localFilter, paginationFilter])

  const fetchData = React.useCallback(async ()=>{
    const resPrice = await coinApi.getPrice();
    const resHeroes = await heroApi.getAll(networkFilter);

    const newPrice = resPrice.data ? resPrice.data : data.price;
    const newHeroes = resHeroes.data ? resHeroes.data : heroesRef.current;
    if(newHeroes===null || newPrice===null){
      setData(rev=>({
        ...rev,
        isFetching: false
      }))
      return;
    }
    heroesRef.current = newHeroes;

    const newFilteredHeroes = filterHeroes(newHeroes, newPrice);
    setData(rev=>({
      ...rev,
      filteredHeroes: newFilteredHeroes.filtered,
      total: newFilteredHeroes.total,
      price: {
        WBNB: newPrice?.WBNB || 0,
        THC: newPrice?.THC || 0,
        THG: newPrice?.THG || 0
      },
      isFetching: false
    }))
  },[data.price, filterHeroes, networkFilter])

  const onRecall = React.useCallback(()=>{
    if(data.isFetching) return;
    setData(rev=>({
      ...rev,
      isFetching: true
    }))
  },[data.isFetching])

  React.useEffect(()=>{
    if(data.isFetching) fetchData();
  },[data.isFetching, fetchData])

  React.useEffect(()=>{
    setData(rev=>({
      ...rev,
      isFetching: true
    }))
  },[networkFilter])

  React.useEffect(()=>{
    if(heroesRef.current===null || data.price===null){
      return;
    }
    const newFilteredHeroes = filterHeroes(heroesRef.current, data.price);
    setData(rev=>({
      ...rev,
      filteredHeroes: newFilteredHeroes.filtered,
      total: newFilteredHeroes.total,
    }))
  },[data.price, filterHeroes, localFilter])

  const handleRarityChange = (checkedValues: CheckboxValueType[]) => {
    const values: number[] = checkedValues.map(
      value=>JSON.parse(JSON.stringify(value))
    );
    setNetworkFilter(rev => ({
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
      setLocalFilter(rev => ({
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
      setLocalFilter(rev => ({
        ...rev,
        battleDaysRemaining: value
      }))
    }, 2000)
  }

  const onPaginationChange = (pageNumber: number) => {
    setLocalFilter(rev=>({
      ...rev,
      pagination: {
        ...rev.pagination,
        pageIndex: pageNumber - 1
      }
    }))
  }

  const heroListComponent = React.useMemo(() => {
    if(data.price && data.filteredHeroes){
      return data.filteredHeroes.map((_hero) =>
        (<Col key={_hero.refId} lg={8} md={12} sm={24}
              style={{
                display: 'flex', justifyContent: 'center',
                width: '100%', padding: 20
              }}>
          {data.price !== null &&
            (<HeroItem hero={_hero} price={data.price}/>)}
        </Col>)
      )
    }
    return <></>
  }, [data.filteredHeroes, data.price])

  console.log('hero ref', heroesRef);
  console.log('data', data);
  return (
    <>
      <Head>
        <title>Thetan Arena Tool</title>
        <link rel='icon' href={'/favicon.png'}/>
        <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
      </Head>
      <div className={styles['home-container']}>

        <Filter
          onRecall={onRecall} networkFilter={networkFilter}
          localFilter={localFilter}
          isFetching={data.isFetching}
          handleRarityChange={handleRarityChange}
          handleProfitChange={handleProfitChange}
          handleBattleDaysChange={handleBattleDaysChange}
        />


        {/*price*/}
        <Row>
          <Col md={6} sm={4} xs={3}/>
          <Col md={12} sm={16} xs={18} className={styles['price-box']}>
            <Price price={data.price}/>
          </Col>
        </Row>

        {/*paging*/}
        <Row>
          <Col span={24} className={styles['pagination-box']}>
            {(data.filteredHeroes !== null && data.filteredHeroes.length > 0) ? (
              <Pagination
                current={localFilter.pagination.pageIndex + 1}
                pageSize={6}
                defaultCurrent={1}
                onChange={onPaginationChange}
                total={data.total}
              />) : (
              <Pagination
                pageSize={6}
                defaultCurrent={1}
                total={6}
              />)}
          </Col>
        </Row>
        {
          data.isFetching ? (
            <Row className={styles.loading}>
              <Typography.Title>...Loading</Typography.Title>
            </Row>
          ) : (data.filteredHeroes !== null && data.filteredHeroes.length === 0) && (
            <Row className={styles.loading}>
              <Typography.Title>No data</Typography.Title>
            </Row>
          )
        }
        <div className={styles['hero-list']}>
          <Row style={{width: '100%', maxWidth: 1400}}>
            {data.isFetching || heroListComponent}
          </Row>
        </div>

        {/*paging*/}
        <Row>
          <Col span={24} className={styles['pagination-box']}>
            {(data.filteredHeroes !== null && data.filteredHeroes.length > 0) ? (
              <Pagination
                current={localFilter.pagination.pageIndex + 1}
                pageSize={6}
                defaultCurrent={1}
                onChange={onPaginationChange}
                total={data.total}
              />) : (
              <Pagination
                pageSize={6}
                defaultCurrent={1}
                total={6}
              />)}
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Home
