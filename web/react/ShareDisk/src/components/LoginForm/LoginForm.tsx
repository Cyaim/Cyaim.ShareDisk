import React, { Component } from 'react'
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import './LoginForm.css';

const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

export class LoginForm extends Component {
    render() {
        return (
            <div>
                <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true, agree:true }}
                onFinish={onFinish}
                autoComplete="off">
                    <Form.Item className="item">
                        <p className="login-title">用户登录</p>
                    </Form.Item>

                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: '请输入用户名！' }]}>
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                    </Form.Item>

                    <Form.Item
                    style={{ marginBottom:"15px" }}
                    name="password"
                    rules={[{ required: true, message: '请输入密码！' }]}>
                    <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="密码"/>
                    </Form.Item>

                    <Form.Item className="item">
                        <Form.Item className="remember" 
                        name="remember" 
                        valuePropName="checked">
                            <Checkbox>记住我</Checkbox>
                        </Form.Item>
                        <a className="login-form-forgot" href="http://localhost:3000/">
                        忘记密码
                        </a>
                    </Form.Item>

                    <Form.Item className="item">
                        <Form.Item className="agree" 
                        name="agree" 
                        valuePropName="checked"
                        rules={[
                            {
                            validator: (_, value) =>
                                value ? Promise.resolve() : Promise.reject('需接受协议才能登陆'),
                            },
                        ]}>
                            <Checkbox>同意《<a href="http://localhost:3000/">协议</a>》 《<a href="http://localhost:3000/">隐私政策</a>》</Checkbox>
                        </Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                        登录
                        </Button>
                        或 <a href="http://localhost:3000/register">立即注册</a>
                    </Form.Item>

                    <Form.Item className="item">
                        快速登陆：
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default LoginForm
