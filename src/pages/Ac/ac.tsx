import { Button, Col, Form, Input, Modal, Row, Select, Space, Switch, Table, Tag, notification, InputNumber } from "antd";
import Column from "antd/lib/table/Column";
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { api } from "../../api";
const Container = styled.div`
display: flex;
flex-direction: column;
gap: 1rem;
`;

const { Option } = Select;

const Ac = () => {

    const [dataModal, setDataModal] = useState<any>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisibleCreate, setIsModalVisibleCreate] = useState(false);
    const [isLoading, setisLoading] = useState<boolean>(true);
    const [dataSource, setdataSource] = useState<Array<any>>([]);

    const [form] = Form.useForm();
    const [formEdit] = Form.useForm();

    const showModal = (data: any) => {
        setIsModalVisible(true);
        setDataModal(data);
        formEdit.setFieldsValue({
            name: data.name,
            mac: data.mac,
            localization: data.localization,
            degress: data.degress,
            protocol: data.protocol,
            power: data.power,
        });
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const showModalCreate = () => {
        setIsModalVisibleCreate(true);
    };

    const handleOkCreate = () => {
        setIsModalVisibleCreate(false);
    };

    const handleCancelCreate = () => {
        setIsModalVisibleCreate(false);
    };

    const onFinishCreate = (values: any) => {
        api.post('/Ac/new', values).then(res => {
            notification.open({
                message: 'Criado com Sucesso',
                type: "success"
            });
            loadData();
        }).catch(err => {
            notification.open({
                message: 'Error ao Adicionar',
                type: "error"
            });
            console.log(err);
        });
    };
    const deleteDevice = (data: any) => {
        api.delete("Ac/delete/" + data._id).then(() => {
            loadData();
            notification.open({
                message: 'Deletado com Sucesso',
                type: "success"
            })
        }).catch(err => {
            console.log(err);
            notification.open({
                message: 'Erro ao deletar!',
                type: "error"
            })
        })
    }
    const editDevice = (data: any) => {
        console.log(data);

        api.put("Ac/edit/" + dataModal._id, data).then(() => {
            loadData();
            notification.open({
                message: "Atualizado com sucesso!"
                , type: "success"
            })
        }).catch(err => {
            console.log(err);
            notification.open({
                message: 'Erro ao Atualizar!',
                type: "error"
            })
        })
    }

    const onFinishFailedCreate = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    function loadData() {
        api.get("/AcGetAll").then((data) => {
            setdataSource(data.data);
            setisLoading(false);
        }, (err) => {
            console.log(err);
        })
    }
    useEffect(() => {
        loadData();
    }, []);

    return (
        <Container>
            <Button type="primary" size="large" style={{ width: "fit-content", alignSelf: "end" }} onClick={showModalCreate}>
                Adicionar
            </Button>
            <Table dataSource={dataSource} loading={isLoading}>
                <Column
                    title="id"
                    dataIndex="firstName"
                    key="firstName"
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
                    title="Localização"
                    dataIndex="localization"
                    key="localization" />
                <Column
                    title="MAC"
                    dataIndex="mac"
                    key="mac" />
                <Column
                    title="Marca"
                    dataIndex="protocol"
                    key="protocol" />
                <Column
                    title="Temperatura"
                    dataIndex="degress"
                    key="degress"
                    render={
                        (record: any, state: any, index: any) => (
                            <>
                                {record + "°C"}
                            </>)
                    } />
                <Column
                    title="Estado"
                    dataIndex="power"
                    key="power"
                    render={
                        (record: any, state: any, index: any) => (
                            <>
                                <Tag color={record == 1 ? 'green' : 'red'} key={record}>
                                    {record == 1 ? 'Ligado' : 'Desligado'}
                                </Tag>
                            </>)
                    } />
                <Column
                    title="Açoes"
                    dataIndex="action"
                    key="action"
                    render={
                        (text: any, record: any, index: any) => (<>
                            <Space size={12}>
                                <Button type="primary" danger onClick={() => { deleteDevice(record) }}>Deletar</Button>
                                <Button type="primary" onClick={() => { showModal(record) }}>Editar</Button>
                            </Space>
                        </>)
                    } />

            </Table>
            <Modal title="Adicionar"
                visible={isModalVisibleCreate}
                onCancel={handleCancelCreate}
                onOk={() => {
                    handleOkCreate();
                    form
                        .validateFields()
                        .then(values => {
                            form.resetFields();
                            onFinishCreate(values);
                        })
                        .catch(info => {
                            console.log('Validate Failed:', info);
                        });
                }}>

                <Form
                    form={form}
                    name="add_Ac"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinishCreate}
                    onFinishFailed={onFinishFailedCreate}
                    autoComplete="off"
                >
                    <Row>
                        <Col span={8}>
                            <Form.Item
                                name="name"
                                rules={[{ required: true, message: 'Preencha o nome do Ar!' }]}>
                                <Input placeholder="Nome" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="mac"
                                rules={[{ required: true, message: 'Preencha o mac!' }]}>
                                <Input placeholder="MAC" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="localization"
                                rules={[{ required: true, message: 'preencha a localização' }]}
                            >
                                <Input placeholder="Localização" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="degress"
                                rules={[{ required: true, message: 'Temperatura!' }]}
                            >
                                <Input placeholder="Temperatura" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="protocol"
                                rules={[{ required: true, message: 'marca!' }]}
                            >
                                <Select>
                                    <Option value="SAMSUNG_AC">Samsung</Option>
                                    <Option value="ELECTRA_AC">Elgin</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="power"
                                rules={[{ required: true, message: 'Estado atual!' }]}>
                                <Switch checkedChildren="ON" unCheckedChildren="OFF" defaultChecked />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <Modal title="Editar"
                visible={isModalVisible}
                onCancel={handleCancel}
                onOk={() => {
                    handleOk();
                    formEdit
                        .validateFields()
                        .then(values => {
                            formEdit.resetFields();
                            editDevice(values);
                        })
                        .catch(info => {
                            console.log('Validate Failed:', info);
                        });
                }}>
                <Form
                    form={formEdit}
                    name="edit"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={editDevice}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Row>
                        <Col span={8}>
                            <Form.Item
                                name="name"
                                rules={[{ required: true, message: 'Preecha o nome do Ar!' }]}>
                                <Input placeholder="Nome" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="mac"
                                rules={[{
                                    required: true,
                                    message: 'Preencha o mac!',
                                }]}>
                                <Input placeholder="MAC" value={dataModal?.mac} type="text" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="localization"
                                rules={[{ required: true, message: 'preencha a localização' }]}
                            >
                                <Input placeholder="Localização" value={dataModal?.localization} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="degress"
                                rules={[{
                                    required: true, message: 'Temperatura!',
                                }]}
                            >
                                <Input placeholder="Temperatura" value={dataModal?.degress} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="protocol"
                                rules={[{ required: true, message: 'marca!' }]}
                            >
                                <Select>
                                    <Option value="SAMSUNG_AC">Samsung</Option>
                                    <Option value="ELECTRA_AC">Elgin</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="power"
                                rules={[{ required: true, message: 'Estado atual!' }]}
                            >
                                <Switch checkedChildren="ON" unCheckedChildren="OFF" defaultChecked={dataModal?.power} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </Container>
    );
}
export default Ac;

