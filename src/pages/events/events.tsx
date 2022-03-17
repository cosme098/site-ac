import { Button, Col, Drawer, Form, Input, notification, Row, Select, Space, Table, Tag, TimePicker } from "antd";
import Column from "antd/lib/table/Column";
import moment from "moment";
import React, { Key, useEffect, useState } from "react"
import styled from "styled-components"
import { api } from "../../api";
import { routine } from "../../interfaces";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    `;

const format = 'HH:mm';

const { Option } = Select;

const Events = (customKey: any, key: Key) => {
    const [loading, setLoading] = useState(true);
    const [ars, setArs] = useState<Array<any>>()
    const [visible, setVisible] = useState(false);
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [currentId, setId] = useState<string>()
    const [dataSource, setdataSource] = useState<Array<any>>([]);

    const [form] = Form.useForm();
    const [formEdit] = Form.useForm();


    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };
    const getRoutines = async () => {
        await api.get("/routinesAll").then(res => {
            setdataSource(res.data);
            console.log(res.data);

        }, err => {
            notification.error({
                message: "Error",
                description: err.message
            })
        });

        setLoading(false);
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    function handleChange(value: any) {
        console.log(`selected ${value}`);
    }

    function onCreateRoutine() {
        form
            .validateFields()
            .then(values => {
                form.resetFields();

                const hour = new Date(values.hour)
                const newroutine: Object = {
                    name: values.name,
                    days: values.days,
                    timer: [{ hour: hour.getHours(), minute: hour.getMinutes() }],
                    ars: values.ars,
                    action: values.action,
                    state: values.state,
                    timeTurnOff: values.timeTurnOff,
                };
                api.post('routines/new', newroutine as Array<any>).then(res => {
                    getRoutines();
                    setVisible(false);
                    notification.open({
                        message: 'Rotina cadastrada',
                        type: 'success',
                    });
                }, err => {
                    notification.open({
                        message: 'Rotina nao cadastrada',
                        type: 'error',
                    });
                })
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    }

    const deleteRoutine = (routine: any) => {
        api.delete(`routines/delete/${routine._id}/${routine.name}`).then(res => {
            getRoutines();
            notification.open({
                message: 'Rotina deletada',
                type: 'success',
            });
        }, err => {
            notification.open({
                message: `Rotina nao deletada ${err.message}`,
                type: 'error',
            });
        })
    }
    const openDrawnEdit = (routine: any) => {
        setVisibleEdit(true);
        const hour = new Date()
        setId(routine._id.toString());
        hour.setHours(parseInt(routine.timer[0].hour), parseInt(routine.timer[0].minute));
        formEdit.setFieldsValue({
            name: routine.name,
            days: routine.days,
            timer: "12:00",
            ars: routine.ars,
            action: routine.action,
            state: routine.state,
        });
    }
    const editRoutine = () => {
        formEdit.validateFields().then(values => {
            formEdit.resetFields();
            const hour = new Date(values.hour)
            const newroutine: Object = {
                name: values.name,
                days: values.days,
                timer: [{ hour: hour.getHours(), minute: hour.getMinutes() }],
                ars: values.ars,
                action: values.action,
                state: values.state[0],
                _id: currentId
            };

            api.put('routines/update', newroutine as Array<any>).then(res => {
                getRoutines();
                setVisibleEdit(false);
                notification.open({
                    message: 'Rotina editada',
                    type: 'success',
                });
            }, err => {
                notification.open({
                    message: 'Rotina nao editada',
                    type: 'error',
                });
            })
        }, err => {
            notification.open({
                message: 'Rotina nao editada, verifique os campos',
                type: 'error',
            });
        })
    }

    const loadArs = () => {
        api.get('/AcGetAll').then(data => {
            setArs(data.data);
            setLoading(false);
        }, (err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        loadArs();
        getRoutines();
    }, [])

    return (
        <Container key={customKey}>
            <Button type="primary" style={{ width: "fit-content", alignSelf: "end" }} onClick={showDrawer}> Adicionar</Button>

            <Table dataSource={dataSource} loading={loading}>
                <Column
                    title="id"
                    dataIndex="index"
                    key="index"
                    render={
                        (text: string, record: any, index: number) => (
                            <>
                                <span>{index}</span>
                            </>
                        )
                    }
                />
                <Column
                    title="Nome"
                    dataIndex="name"
                    key="name" />
                <Column
                    title="Ação"
                    dataIndex="action"
                    key="action"
                    render={
                        (text: string, record: any, index: number) => (
                            <>
                                <span>{text + "°C"}</span>
                            </>
                        )
                    } />
                <Column
                    title="Estado"
                    dataIndex="state"
                    key="state"
                    render={
                        (text: string, record: routine, index: number) => (
                            <>
                                <Tag color={record.state as any === 1 ? 'green' : 'red'} key={record.name}>{record.state === 1 ? 'Ligado' : 'Desligado'}</Tag>
                            </>
                        )
                    } />



                <Column
                    title="Hora"
                    dataIndex="hour"
                    key="hour"
                    render={(text: string, record: any, index: number) => (
                        <>
                            {JSON.stringify(record.timer[0]?.hour) + ":" + JSON.stringify(record.timer[0]?.minute)}
                        </>
                    )}
                />
                <Column
                    title="Açoes"
                    dataIndex="action"
                    key="action"
                    render={
                        (text: any, record: any, index: any) => (<>
                            <Space size={12} key={record.name}>
                                <Button type="primary" danger onClick={() => deleteRoutine(record)}>Deletar</Button>
                                <Button type="primary" onClick={() => openDrawnEdit(record)}>Editar</Button>
                            </Space>
                        </>)
                    } />

            </Table>

            {/* this Drawer is add routine */}

            <Drawer title="Adicionar Routina" size="large" placement="right" onClose={onClose} visible={visible}>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    autoComplete="off">

                    <Row>
                        <Col span={24}>
                            <Form.Item
                                name="name"
                                rules={[{ required: true, message: 'Nome!' }]}>
                                <Input placeholder="Nome" />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="days"
                                rules={[{ required: true, message: 'dias da rotina!' }]}>
                                <Select mode="tags" key="days" placeholder="Dias">
                                    <Option value={0} key={1}>Domingo</Option>
                                    <Option value={1} key={2}>Segunda-Feira</Option>
                                    <Option value={2} key={3}>Terça-Feira</Option>
                                    <Option value={3} key={4}>Quarta-Feira</Option>
                                    <Option value={4} key={5} >Quinta-Feira</Option>
                                    <Option value={5} key={6}>Sexta-Feira</Option>
                                    <Option value={6} key={7}>Sabado-Feira</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="ars">
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Ar-condicionados"
                                >
                                    {
                                        ars?.map((data: any) => {
                                            return (<Option value={data._id} key={data.name}>{data.name}</Option>)
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="action"
                                rules={[{ required: true, message: 'Ação da rotina!' }]}>
                                <Select placeholder="Ação" key="action" onChange={handleChange}>
                                    <Option value={18} key={24}>18</Option>
                                    <Option value={19} key={25}>19</Option>
                                    <Option value={20} key={26}>20</Option>
                                    <Option value={21} key={27}>21</Option>
                                    <Option value={22} key={28}>22</Option>
                                    <Option value={23} key={29}>23</Option>
                                    <Option value={24} key={30}>24</Option>
                                    <Option value={25} key={31}>25</Option>
                                    <Option value={26} key={32}>26</Option>
                                    <Option value={27} key={33}>27</Option>
                                    <Option value={28} key={34}>28</Option>
                                    <Option value={29} key={35}>29</Option>
                                    <Option value={30} key={36}>29</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="state"
                                rules={[{ required: true, message: 'Estado do Ar!' }]}>
                                <Select placeholder="Estado" key="State" >
                                    <Option value={0} key={30}>OFF</Option>
                                    <Option value={1} key={31}>ON</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                name="hour"
                                rules={[{ required: true, message: 'Hora da rotina!' }]}>
                                <TimePicker placeholder="Selecione a hora" value={moment('12:08', format)} format={format} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="timeTurnOff"
                                rules={[{ required: true, message: 'Hora de fim rotina!' }]}>
                                <TimePicker placeholder="Fim da rotina" value={moment('12:08', format)} format={format} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4}>
                            <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
                                <Button type="primary"
                                    onClick={onCreateRoutine}>
                                    Adicionar
                                </Button>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Button type="primary" onClick={() => { setVisible(false) }} danger>
                                Cancelar
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Drawer>

            {/* this Drawer is edit routine */}

            <Drawer title="Adicionar Routina" size="large" placement="right" onClose={() => setVisibleEdit(false)} visible={visibleEdit}>
                <Form
                    form={formEdit}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    autoComplete="off">

                    <Row>
                        <Col span={24}>
                            <Form.Item
                                name="name"
                                rules={[{ required: true, message: 'Nome!' }]}>
                                <Input placeholder="Nome" />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="days"
                                rules={[{ required: true, message: 'dias da rotina!' }]}>
                                <Select mode="tags" key="days" placeholder="Dias">
                                    <Option value={0} key={1}>Segunda-Feira</Option>
                                    <Option value={1} key={2}>Terça-Feira</Option>
                                    <Option value={2} key={3}>Quarta-Feira</Option>
                                    <Option value={3} key={4} >Quinta-Feira</Option>
                                    <Option value={4} key={5}>Sexta-Feira</Option>
                                    <Option value={5} key={6}>Sabado-Feira</Option>
                                    <Option value={6} key={7}>Domingo</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="ars">
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Ar-condicionados"
                                >
                                    {
                                        ars?.map((data: any) => {
                                            return (<Option value={data._id} key={data.name}>{data.name}</Option>)
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="action"
                                rules={[{ required: true, message: 'Ação da rotina!' }]}>
                                <Select placeholder="Ação" key="action" onChange={handleChange}>
                                    <Option value={16} key={22}>16</Option>
                                    <Option value={17} key={23}>17</Option>
                                    <Option value={18} key={24}>18</Option>
                                    <Option value={19} key={25}>19</Option>
                                    <Option value={20} key={26}>20</Option>
                                    <Option value={21} key={27}>21</Option>
                                    <Option value={22} key={28}>22</Option>
                                    <Option value={23} key={29}>23</Option>
                                    <Option value={24} key={30}>24</Option>
                                    <Option value={25} key={31}>25</Option>
                                    <Option value={26} key={32}>26</Option>
                                    <Option value={27} key={33}>27</Option>
                                    <Option value={28} key={34}>28</Option>
                                    <Option value={29} key={35}>29</Option>
                                    <Option value={30} key={36}>29</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="state"
                                rules={[{ required: true, message: 'Estado do Ar!' }]}>
                                <Select placeholder="Estado" key="State" >
                                    <Option value={0} key={30}>OFF</Option>
                                    <Option value={1} key={31}>ON</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                name="hour"
                                rules={[{ required: true, message: 'Hora da rotina!' }]}>
                                <TimePicker placeholder="Selecione a hora" format={format} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="timeTurnOff"
                                rules={[{ required: true, message: 'Hora de fim rotina!' }]}>
                                <TimePicker placeholder="Fim da rotina" value={moment('12:08', format)} format={format} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4}>
                            <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
                                <Button type="primary"
                                    onClick={editRoutine}>
                                    Adicionar
                                </Button>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Button type="primary" onClick={() => { setVisibleEdit(false) }} danger>
                                Cancelar
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </Container>
    )
}

export default Events;