import React, { Component } from 'react'
import { Progress, Dropdown, Card } from 'antd';

const DropdownCard = (
    <Card className="dropCardStorage">
        <Progress percent={20} />
        <div>已用 12.34 MB / 1024 GB</div>
    </Card>
);

export class BtnProgress extends Component {
    render() {
        return (
            <div>
                <Dropdown overlay={DropdownCard} placement="bottomRight">
                    <Progress className="dashProgress" width={50} type="circle" percent={20} />
                </Dropdown>
            </div>
        )
    }
}

export default BtnProgress
