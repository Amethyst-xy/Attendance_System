import React, {Component} from 'react';
import { Row, Col} from 'antd';
import './not-found.less';

export default class NotFound extends Component {
  render() {
    return (
      <Row className='not-found'>
        <Col span={12} className='left'/>
        <Col span={12} className='right'>
          <h1>404</h1>
          <h2>抱歉，你访问的页面不存在</h2>
        </Col>
      </Row>
    )
  }
}