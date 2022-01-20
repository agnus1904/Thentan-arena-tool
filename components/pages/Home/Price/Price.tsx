import React from 'react';
import {Col, Image, Row} from "antd";
import styles from './styles.module.scss';
import priceConstant from "../../../../assets/constants/price";
import {IPrice} from "../../../../models";


interface PriceProps {
  price: null | IPrice
}

const Price: React.FC<PriceProps> = (props) => {
  const {price} = props;

  return (
    <Row className={styles['price-items']}>
      <Col span={8} className={styles['price-item']}>
        <Image
          src={priceConstant.image.THC}
          alt={'THC Image'} width={20} preview={false}
        />&nbsp;&nbsp;{price?.THC || '---'}&nbsp;<span style={{color: '#09d509'}}>$</span>
      </Col>
      <Col span={8} className={styles['price-item']}>
        <Image
          src={priceConstant.image.THG}
          alt={'THG Image'} width={20} preview={false}
        />&nbsp;&nbsp;{price?.THG || '---'}&nbsp;<span style={{color: '#09d509'}}>$</span>
      </Col>
      <Col span={8} className={styles['price-item']}>
        <Image
          src={priceConstant.image.WBNB}
          alt={'WBNB Image'} width={20} preview={false}
        />&nbsp;&nbsp;{price?.WBNB || '---'}&nbsp;<span style={{color: '#09d509'}}>$</span>
      </Col>
    </Row>
  );
};


export default Price;