import './template.css'
import { Layout, Menu, Button } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    AreaChartOutlined,
    LogoutOutlined,
    PicCenterOutlined
} from '@ant-design/icons';
import {signOut} from "../auth/auth";
import { useState } from "react";
import React from "react";
import CalendarOutlined from "@ant-design/icons/lib/icons/CalendarOutlined";
import { useNavigate } from "react-router-dom";
const { Header, Sider, Content } = Layout;

export default function Template(props: any, key: any): JSX.Element {
    let navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(true);

    const signout = () => {
        signOut().then(() => {
            navigate('/login')
        });
    }
    
    function toggle() {
        setCollapsed(!collapsed);
    }
    return (
            <Layout className="container-layout" style={{height:"100vh"}}>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <div className="logo" />
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1" icon={<AreaChartOutlined />} dir="" >
                            <a href="/dashboad">
                                Dashboard
                            </a>
                        </Menu.Item>
                        <Menu.Item key="2" icon={<PicCenterOutlined />}>
                            <a href="/Add-Ac">
                                Ar-condicionados
                            </a>
                        </Menu.Item>
                        <Menu.Item key="4" icon={<CalendarOutlined />}>
                            <a href="/Events">
                                Eventos
                            </a>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background"  
                    style={{ padding: 0,
                     display: "flex",
                     alignItems:"center",
                     justifyContent:"space-between",
                     paddingRight:"1vw"}}>
                       <div style={{margin:"none"}}>
                       {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: toggle,
                            style: {
                                fontSize: '20px',
                                margin: '0px 20px',
                            },
                        })}
                      <span className="component-Name">{props.componentName}</span>
                       </div>
                       <Button type='primary' style={{marginBottom: "5px",}}  danger size="middle"  icon={<LogoutOutlined /> } onClick={()=>{signout()}} />
                    </Header>
                    <Content
                        className="site-layout-background"
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                        }}
                    >
                        {props.children}
                    </Content>
                </Layout>
            </Layout>
    );
}