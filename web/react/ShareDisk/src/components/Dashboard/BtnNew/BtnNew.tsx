import React, { Component } from 'react';
import { Button, Menu, Dropdown } from 'antd';
import Icon from '@ant-design/icons';

import {ReactComponent as AddIcon} from '../../../assets/icons/add.svg'
import {ReactComponent as DocIcon} from '../../../assets/icons/document-text.svg'
import {ReactComponent as FolderIcon} from '../../../assets/icons/folder.svg'
import {ReactComponent as AddFolderIcon} from '../../../assets/icons/folder-add.svg'
import {ReactComponent as WordIcon} from '../../../assets/icons/office-word.svg'
import {ReactComponent as ExcelIcon} from '../../../assets/icons/office-excel.svg'
import {ReactComponent as PptIcon} from '../../../assets/icons/office-pptx.svg'

const menu = (
    <Menu style={{ minWidth:"250px" }}>
        <p className="dropLabel">上传</p>
        <Menu.Item className="dropItem">
            <Icon component={DocIcon} 
            className="dashIcon"/>
            文件
        </Menu.Item>
        <Menu.Item className="dropItem">
            <Icon component={FolderIcon} 
            className="dashIcon"/>
            文件夹
        </Menu.Item>
        <hr className="dashHr" style={{ margin:"0" }} />
        <p className="dropLabel">新建</p>
        <Menu.Item className="dropItem">
            <Icon component={AddFolderIcon} 
            className="dashIcon"/>
            新建文件夹
        </Menu.Item>
        <hr className="dashHr" style={{ margin:"0" }} />
        <p className="dropLabel">Office 文档</p>
        <Menu.Item className="dropItem">
            <Icon component={WordIcon} 
            className="dashIcon"/>
            Word 文档
        </Menu.Item>
        <Menu.Item className="dropItem">
            <Icon component={ExcelIcon} 
            className="dashIcon"/>
            Excel 表格
        </Menu.Item>
        <Menu.Item className="dropItem">
            <Icon component={PptIcon} 
            className="dashIcon"/>
            PPT 幻灯片
        </Menu.Item>
    </Menu>
);

export class NewFile extends Component {
    render() {
        return (
            <span>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button 
                    size="large"
                    type="primary"
                    className="dashButton">
                        <Icon component={AddIcon} 
                        className="dashIcon newIcon"
                        style={{marginLeft:"0px"}}/>
                        新建
                    </Button>
                </Dropdown>
            </span>
        )
    }
}

export default NewFile
