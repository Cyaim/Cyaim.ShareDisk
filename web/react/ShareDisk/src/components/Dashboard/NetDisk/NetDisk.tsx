import React, { Component } from 'react';
import { List, Card, Breadcrumb, Checkbox } from 'antd';
import { Link, Route } from 'react-router-dom';
import queryString from 'query-string';
import FILE_ICONS from './fileIcons';

import './NetDisk.css';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

type Data = {
    key: string;
    type: string;
    title: string;
    children?: Data;
}[];

var checkList: string[] = [];

// Item type of File
function File (props: any) {
    let ext = props.item.title.split(".")[1];
    
    return (
        <Card className="diskCard" hoverable={true} bodyStyle={{ padding:"10px" }}>
            <div>
                {FILE_ICONS[ext] || FILE_ICONS["unknown"]}
            </div>
            <span title={props.title} className="diskText">{props.item.title}</span>
        </Card>
    )
}

// Item type of Folder
function Folder (props: any) {
    return (
        <Card className="diskCard" 
        hoverable={true} 
        bodyStyle={{ padding:"10px" }}>
            <div>
                {FILE_ICONS["folder"]}
            </div>
            <span title={props.item.title} className="diskText">{props.item.title}</span>
        </Card>
    )
}

function displayAll() {
    let array = Array.from(document.getElementsByClassName("diskCheck") as HTMLCollectionOf<HTMLElement>);
    for (let i=0; i<array.length; i++) {
        array[i].style.display = "block";
    }
}

function hideAll() {
    let array = Array.from(document.getElementsByClassName("diskCheck") as HTMLCollectionOf<HTMLElement>);
    for (let i=0; i<array.length; i++) {
        array[i].style.display = "";
    }
}

// Return either File or Folder
function Disk (props: any) {
    let key = props.item.key;
    let update = props.edit;

    function handleChange(props: CheckboxChangeEvent) {
        let checked = props.target.checked;
        if (checked) {
            checkList.push(key);
        } else {
            checkList.pop();
        }
        if (checkList.length > 0) {
            displayAll();
        } else {
            hideAll();
        }
        update(checkList);
    }

    if (props.item.type === "file") {
        return (
            <>
            <Checkbox className="diskCheck" onChange={handleChange}/>
            <File item={props.item} />
            </>
        )
    }
    if (props.item.type === "folder") {
        if (props.isRoot) {
            return (
                <>
                <Checkbox className="diskCheck" onChange={handleChange}/>
                <Link to={`?path=/${props.item.key}`}>
                    <Folder item={props.item}>
                        <Disk item={props.item.children} />
                    </Folder>
                </Link>
                </>
            )
        } else {
            return (
                <>
                <Checkbox className="diskCheck" onChange={handleChange}/>
                <Link to={`${props.path}/${props.item.key}`}>
                <Folder item={props.item}>
                    <Disk item={props.item.children} />
                </Folder>
                </Link>
                </>
            )
        }
    }
    return null;
}

// Main rendering part
function Page (props: any) {
    // Clear checkList on page load
    if (performance.navigation.type === 1) checkList = [];

    // Add query string if loads dashboard
    let search = (props.location.search)? (props.location.search) : "?path=/";
    search = queryString.parse(search);

    // pathList for breadcrumb rendering
    let pathList = search.path.split('/');

    // keyList for data rendering
    let keyList = pathList.slice(1, pathList.length);
    
    // pathList for Root
    pathList = (JSON.stringify(pathList) === JSON.stringify(["", ""]))? [""]: pathList;
    
    // pass isRoot and path to <Link /> in <Disk />
    let isRoot = true;
    if (keyList[0] !== "") isRoot = false;
    let path = props.location.pathname + props.location.search;
    
    // Initialize render data and breadcrumb list
    let renderData: Data = props.data;
    let breadList = ["全部"];
    
    // Find children to render
    if (!isRoot) {
        let file;
        for (let i=0; i<keyList.length; i++) {
            file = renderData.find(({ key }) => key === keyList[i]);
            if (file?.children) {
                breadList.push(file.title);
                renderData = file.children;
            }
        }
    }
    
    // Beardcrumb items
    const breadItems = pathList.map((_: any, index: number) => {
        const url = `?path=/${pathList.slice(1, index + 1).join('/')}`;
        return (
            <Breadcrumb.Item key={url}>
                <Link to={url}>{breadList[index]}</Link>
            </Breadcrumb.Item>
        );
    });
    
    return (
        <>
        <Breadcrumb className="dashBread" separator=">">
            {breadItems}
        </Breadcrumb>
        <List 
        grid={{ gutter: 16 }}
        dataSource={renderData}
        renderItem={item => (
            <List.Item className="diskItem" key={item.key}>
                <Disk item={item} isRoot={isRoot} path={path} edit={props.edit}/>
            </List.Item>
        )} />
        </>
    )
}

interface NetDiskProps {
    data: Data;
    edit: any;
}

export class NetDisk extends Component<NetDiskProps, {}> {
    render() {
        return (
            <div>
                <Route path="/" component={(props: any) => 
                <Page 
                {...props}
                data={this.props.data}
                edit={this.props.edit} />} />
            </div>
        )
    }
}

export default NetDisk
