import React, { Component } from 'react';
import { Layout, Menu, Card, } from 'antd';

import LoginForm from '../LoginForm/LoginForm';
import Background from '../Background/Background';

import './MainLayout.css';

const { Header, Content, Footer } = Layout;

export class MainLayout extends Component {
    
    render() {
        return (
            <div>
                <Background />
                <Layout className="mainLayout">
                    <Header className="mainHeader" style={{ height:"80px" }}>
                        <Menu theme="dark" 
                        mode="horizontal" 
                        defaultOpenKeys={['1']} 
                        defaultSelectedKeys={['1']} 
                        className="mainMenu">
                            <Menu.Item key="1" className="mainMenuItem">首页</Menu.Item>
                            <Menu.Item key="2" className="mainMenuItem">下载</Menu.Item>
                            <Menu.Item key="3" className="mainMenuItem">会员</Menu.Item>
                        </Menu>
                    </Header>

                    <Content className="mainContent">
                        <Card className="loginCard" bodyStyle={{ padding:"5px" }}>
                            <LoginForm />
                        </Card>
                    </Content>

                    <Footer className="mainFooter">
                        Copyright © 2020
                    </Footer>
                </Layout>
                </div>
        )
    }
}

export default MainLayout
