import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { BrowserRouter as Router } from 'react-router-dom';
import Icon from '@ant-design/icons';

import dataDisk from './file_json.json';

import {ReactComponent as AllIcon} from '../../assets/icons/inboxes.svg';
import {ReactComponent as DocIcon} from '../../assets/icons/document.svg';
import {ReactComponent as PicIcon} from '../../assets/icons/photo.svg';
import {ReactComponent as VideoIcon} from '../../assets/icons/video.svg';
import {ReactComponent as MusicIcon} from '../../assets/icons/music.svg';
import {ReactComponent as TimeIcon} from '../../assets/icons/time.svg';
import {ReactComponent as ClassIcon} from '../../assets/icons/chart-pie.svg';
import {ReactComponent as BinIcon} from '../../assets/icons/bin.svg';
import {ReactComponent as LinkIcon} from '../../assets/icons/link.svg';
import {ReactComponent as BtIcon} from '../../assets/icons/telegram.svg';

import './Dashboard.css';
import Search from 'antd/lib/input/Search';
import NewFile from './BtnNew/BtnNew';
import HandleFile from './BtnHandle/BtnHandle'
import NetDisk from './NetDisk/NetDisk';
import BtnAvatar from './BtnAvatar/BtnAvatar';
import SiderTree from './SiderTree/SiderTree';
import BtnProgress from './BtnProgress/BtnProgress';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

type Data = {
    key: string;
    type: string;
    title: string;
    children?: Data;
}[];

var checkList: string[] = [];

const data: Data = dataDisk;

interface DashboardInterface {
    list: string[]
}

export class Dashboard extends Component<{}, DashboardInterface> {
    constructor(props: any) {
        super(props);
        this.state = ({
            list: checkList
        });
        
        this.editList = this.editList.bind(this);
    }

    editList(l: string[]) {
        checkList = l;
        console.log(this.state.list);
    }

    render() {
        return (
            <div>
                <Router basename="/dashboard/">
                <Layout className="dashLayout">
                    <Sider className="dashSider">
                        <h1 style={{ textAlign:"center", margin:"20px" }}>Logo</h1>
                        <hr className="dashHr" />
                        <Menu mode="inline" 
                        defaultSelectedKeys={['0']} 
                        defaultOpenKeys={['0']} 
                        className="dashMenu">
                            <Menu.Item key="0" className="dashItem">
                                <Icon component={AllIcon} className="dashIcon"/>
                                <span className="dashSpan">全部</span>
                            </Menu.Item>
                            <SubMenu 
                            key="sub" 
                            className="dashSubMenu"
                            title="文件类型" 
                            icon={<Icon component={ClassIcon} className="dashIcon"/>}>
                                <Menu.Item key="1" className="dashItem">
                                    <Icon component={TimeIcon} className="dashIcon"/>
                                    <span className="dashSpan">最近</span>
                                </Menu.Item>
                                <Menu.Item key="2" className="dashItem">
                                    <Icon component={DocIcon} className="dashIcon"/>
                                    <span className="dashSpan">文档</span>
                                </Menu.Item>
                                <Menu.Item key="3" className="dashItem">
                                    <Icon component={PicIcon} className="dashIcon"/>
                                    <span className="dashSpan">图片</span>
                                </Menu.Item>
                                <Menu.Item key="4" className="dashItem">
                                    <Icon component={VideoIcon} className="dashIcon"/>
                                    <span className="dashSpan">视频</span>
                                </Menu.Item>
                                <Menu.Item key="5" className="dashItem">
                                    <Icon component={MusicIcon} className="dashIcon"/>
                                    <span className="dashSpan">音乐</span>
                                </Menu.Item>
                            </SubMenu>
                            <Menu.Item>
                                <Icon component={BinIcon} className="dashIcon" />
                                <span className="dashSpan">回收站</span>
                            </Menu.Item>
                            <Menu.Item>
                                <Icon component={LinkIcon} className="dashIcon" />
                                <span className="dashSpan">分享链接</span>
                            </Menu.Item>
                            <Menu.Item>
                                <Icon component={BtIcon} className="dashIcon" />
                                <span className="dashSpan">离线下载</span>
                            </Menu.Item>
                        </Menu>
                        <hr className="dashHr" />
                        <SiderTree data={data} />
                    </Sider>

                    <Layout>
                        <Header className="dashHeader">
                            <span className="dashSpan">
                                {(checkList.length>0)? <HandleFile /> : <NewFile />}
                            </span>
                            <span className="dashSpan">
                            <Search
                            placeholder="搜索"
                            onSearch={value => console.log(value)}
                            className="dashSearch" />
                            </span>
                            <span className="dashSpan" style={{ float:"right" }}>
                                <BtnAvatar />
                            </span>
                            <span className="dashSpan" style={{ float:"right", marginRight:"40px" }}>
                                <BtnProgress />
                            </span>
                        </Header>
                        <hr className="dashHr" style={{ margin:"0" }} />
                        <Content className="dashContent">
                            <NetDisk data={data} edit={this.editList} />
                        </Content>
                    </Layout>
                </Layout>
                </Router>
            </div>
        )
    }
}

export default Dashboard
