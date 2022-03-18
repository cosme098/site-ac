import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Statistic, Card, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { api } from "../../api";


const Container = styled.div``;
const ContainerStatisc = styled.div`
  padding: 30px;
  background: #ececec;
  `;


export default function Home() {

    const [on, setOn] = useState([]);
    const [off, setOff] = useState([]);

    let acOff;
    let acOn;
    useEffect(() => {
        api.get('/api/AcGetAll').then((res: any) => {
            setOn(res.data.filter((item: any) => item.power === 1));
            setOff(res.data.filter((item: any) => item.power === 0));
        })
    }, [])
    return (
        <Container>
            <ContainerStatisc>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="Ligados"
                                value={on.length}
                                precision={0}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<ArrowUpOutlined />}
                                suffix=""
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="Desligados"
                                value={off.length}
                                precision={0}
                                valueStyle={{ color: '#cf1322' }}
                                prefix={<ArrowDownOutlined />}
                                suffix=""
                            />
                        </Card>
                    </Col>
                </Row>
            </ContainerStatisc>
        </Container>
    )
}