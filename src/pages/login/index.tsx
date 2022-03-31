import React from "react";
import styled from "styled-components";
import { Form, Input, Button, notification } from 'antd';
import { api } from "../../api";
import { setTokenAndId } from "../../auth/auth";
import { useNavigate } from "react-router-dom";

const Contanier = styled.div`
    width: 100%;
    height: 100vh;
    background-image: url("./img/background1.png");
    background-repeat: no-repeat;
    background-size: cover;
    filter: drop-shadow(0px 0px 10px #c7c7c7);
    display: flex;
    justify-content: end;
    align-items: center;
    padding-right: 4rem;
`;

const ContainerForm = styled.div`
    width: 25rem;
    height: 40rem;
    display: flex;
    flex-direction: column;
    gap: 4rem;
    justify-content: center;
    align-items: center;
    background: rgba( 188, 177, 177, 0.15 );
    backdrop-filter: blur( 4.5px );
    -webkit-backdrop-filter: blur( 4.5px );
    border-radius: 10px;
    border: 1px solid rgba( 255, 255, 255, 0.18 );
`;

const TITLE = styled.p`
    font-size: 1.5rem;
    font-weight: bolder;
    color: #474747;
    text-align: center;
    `;


const Login = () => {
    let navigate = useNavigate();
    const onFinish = (values: any) => {
        api.post('/api/login', values).then(res => {
            setTokenAndId(res.data);
            console.log(res.data);
            notification.open({
                message: 'Logado com sucesso',
                type: "success"
            });
            navigate('/dashboad');
        }, (err) => {
            console.log(err);
            notification.open({
                message: 'Usuario ou senha errados',
                type: "error"
            });
        }).catch(err => {
            console.log(err);
            notification.open({
                message: 'Usuario ou senha errados',
                type: "error"
            });
        });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Contanier>
            <ContainerForm>
                <TITLE>Sistema de controle de <br /> Ar-condicionados</TITLE>
                <Form
                    name="basic"
                    wrapperCol={{ span: 26 }}
                    size="large"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Coloque seu Email!' }]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Coloque sua Senha!' }]}
                    >
                        <Input.Password placeholder="Senha" />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }} >
                        <Button type="primary" htmlType="submit">
                            Entrar
                        </Button>
                    </Form.Item>
                </Form>
            </ContainerForm>
        </Contanier>
    )
}

export default Login;