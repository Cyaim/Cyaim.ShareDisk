import React, { Component } from 'react';
import FILE_ICONS from './fileIcons';
import { Tree } from 'antd';
import { Link } from 'react-router-dom';

const { DirectoryTree } = Tree;

type Data = {
    key: string;
    type: string;
    title: string;
    children?: Data;
}[];

interface TreeProps {
    data: Data
}

function formatData(props: any, path: string[]) {
    props.map((item: any) => {
        if (item.type === 'file') {
            let ext: string = "";
            if (item.title.includes(".")) {
                ext = item.title.split(".");
                ext = ext[ext.length - 1];
            }
            item.isLeaf = true;
            item.icon = FILE_ICONS[ext];
            if (!item.icon) item.icon = FILE_ICONS["unknow"];
        };
        if (item.type === 'folder') {
            let leafFolder = true;
            path.push(item.key);
            item.title = <Link to={`?path=/${path.join('/')}`} className="siderLink">{item.title}</Link>
            for (let i=0; i<item.children.length; i++) {
                if(item.children[i].type === 'folder') {
                    leafFolder = false;
                    break;
                }
            }
            if (leafFolder) path.pop();
            return formatData(item.children, path);
        }
        return undefined;
    });
    return props;
}

export class SiderTree extends Component<TreeProps, {}> {
    render() {
        let data = JSON.parse(JSON.stringify(this.props.data));
        return (
            <div>
                <DirectoryTree 
                className="siderTree"
                selectable={false}
                treeData={formatData(data, [])}
                />
            </div>
        )
    }
}

export default SiderTree
