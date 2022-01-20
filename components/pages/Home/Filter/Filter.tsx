import React from 'react';
import styles from "./styles.module.scss";
import {Button, Checkbox, Col, Row, Slider, Typography} from "antd";
import {ReloadOutlined} from "@ant-design/icons";
import {CheckboxValueType} from "antd/es/checkbox/Group";
import {IHeroFilter} from "../../../../models";

const {Title} = Typography;

const marksProfit = {
  0: '0%',
  20: '20%',
  40: '40%',
  60: '60%',
  80: '80%',
  100: {
    style: {
      color: '#f50',
    },
    label: <strong>100%</strong>,
  },
}

const marksBattle = {
  0: '0',
  20: '20',
  40: '40',
  60: '60',
  80: '80',
  100: {
    style: {
      color: '#f50',
    },
    label: <strong>100</strong>,
  },
}


interface FilterProps {
  getPrice: () => void;
  isFetching: boolean;
  filter: IHeroFilter;
  filterLocal: {
    profitLowerPercent: number,
    battleDaysRemaining: number
  };
  handleBattleDaysChange: (value: number) => void;
  handleRarityChange: (checkedValues: CheckboxValueType[]) => void;
  handleProfitChange: (value: number) => void;
}

const Filter: React.FC<FilterProps> = (props) => {
  const {
    getPrice,
    filter,
    isFetching,
    filterLocal,
    handleBattleDaysChange,
    handleRarityChange,
    handleProfitChange
  } = props

  return (
    <div className={styles['filter-box']}>
      <Row style={{width: '100%', maxWidth: 1400, paddingRight: 40,}}>
        <Col md={1} sm={0}/>
        <Col md={3} sm={8} xs={8} className={styles['recall-box']}>
          <Button disabled={isFetching}
                  // style={isFetching ? {backgroundColor: 'gray'} : undefined}
                  type={'primary'} onClick={getPrice}>
            <ReloadOutlined/>
          </Button>
        </Col>
        <Col md={8} sm={16} xs={16} style={{
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Title level={4}>Hero rarity</Title>
          <Checkbox.Group
            options={[
              {label: 'Common', value: 0},
              {label: 'Epic', value: 1},
              {label: 'Legendary', value: 2}]}
            defaultValue={filter.heroRarity}
            onChange={handleRarityChange}/>
        </Col>
        <Col md={0} sm={2} xs={1}/>
        <Col md={12} sm={20} xs={22}
             style={{
               marginTop: 10, display: 'flex',
               flexDirection: 'column'
             }}>
          <Row className={styles['profit-box']} >
            <Col sm={6} xs={24}>
              <Title level={4}>Max battle days</Title>
            </Col>
            <Col sm={18} xs={24}>
              <Slider defaultValue={filterLocal.battleDaysRemaining}
                      tooltipPlacement={'right'}
                      tooltipVisible
                      marks={marksBattle}
                      onChange={handleBattleDaysChange}/>
            </Col>
          </Row>

          <Row className={styles['profit-box']} >
            <Col sm={6} xs={24}>
              <Title level={4}>Positive profit</Title>
            </Col>
            <Col sm={18} xs={24}>
              <Slider defaultValue={filterLocal.profitLowerPercent}
                      tooltipPlacement={'right'}
                      tooltipVisible
                      marks={marksProfit}
                      onChange={handleProfitChange}/>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};


export default Filter;