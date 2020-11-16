import React, { Component } from 'react';
import { Avatar, Button, Card, Dropdown, List } from 'antd';
import Icon from '@ant-design/icons';

import {ReactComponent as AddUserIcon} from '../../../assets/icons/user-add.svg';

const Users = [
    {
        title: "User",
        description: "example@account.com"
    },
    {
        title: "User2",
        description: "example@account.com"
    }
];

const DropdownCard = (
    <Card className="dropCard">
        <Avatar size={90} style={{ margin:"10px" }} />
        <div className="dropCardName">用户名</div>
        <div className="dropCardUser">user@account.com</div>
        <Button className="dropBtnLogout" style={{ margin:"0", marginBottom:"15px" }} >我的资料</Button>
        <hr className="dashHr" style={{ margin:"0" }} />
        <List 
        className="dropCardList"
        dataSource={Users}
        renderItem={item => (
            <Card 
            hoverable={true}
            className="dropUsersCard"
            bodyStyle={{ padding:"5px" }}>
            <List.Item.Meta 
            avatar={<Avatar />}
            title={item.title}
            description={item.description}
            />
            </Card>)} 
        />
        <Card className="dropUsersCard" bodyStyle={{ padding:"10px", textAlign:"left" }}>
            <Icon className="dashIcon" 
            component={AddUserIcon} 
            style={{ padding:"5px" }} />添加其他账号
        </Card>
        <hr className="dashHr" style={{ margin:"0" }} />
        <Button className="dropBtnLogout">退出所有账号</Button>
        <hr className="dashHr" style={{ margin:"0" }} />
        <div className="dropLabel">服务协议 · 隐私政策</div>
    </Card>
);

export class BtnAvatar extends Component {
    render() {
        return (
            <div>
                <Dropdown overlay={DropdownCard} trigger={['click']} placement="bottomRight">
                    <Button 
                    className="avatarButton"
                    shape="circle-outline" 
                    style={{ height:"50px", width:"50px" }}>
                        <Avatar size="large" className="dashAvatar"/>
                    </Button>
                </Dropdown>
            </div>
        )
    }
}

export default BtnAvatar
