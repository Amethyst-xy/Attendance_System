import React from 'react';
import {Card,Row,Col} from 'antd';
import Line from './charts_options/line';
import Pie from './charts_options/pie';
import './index.less';

export default function Home(){
    return (
        <div>
            <Card title='折线统计图'>
                <div className='chart_line'>
                    <Line grade={0}/>
                </div>
                <Line grade={1}/>
            </Card>
            <Card title='饼图'>
                <Row>
                    <Col span={12}>
                        <Pie grade={0}/>
                    </Col>
                    <Col span={12}>
                        <Pie grade={1}/>
                    </Col>
                </Row>
            </Card>
        </div>
    );
}