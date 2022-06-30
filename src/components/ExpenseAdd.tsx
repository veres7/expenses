import { useRef } from 'react'
import bigDecimal from 'js-big-decimal';
import { Button, Form, Input, InputNumber } from 'antd';

import store from '../stores/store';
import { observer, } from 'mobx-react';


type Props = {
    euroRate: number
}

function ExpenseAdd({ euroRate }: Props) {
    const formRef = useRef<any>();

    const onFinish = (values: any) => {
        store.addExpense({
            key: `${store.expenses.length + 1}`,
            title: values.title,
            amountPln: values.amountPln,
            amountEur: Number(bigDecimal.divide(values.amountPln, euroRate, 2))
        })
        formRef.current.resetFields()
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed: ', errorInfo);
    };
    return (
        <>
            <Form
                name="basic"
                className='addingBox'
                layout='horizontal'
                labelCol={{ span: 8 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                ref={formRef}
            >
                <div className='columnStyle'>
                    <Form.Item
                        label="Title of transaction"
                        name="title"
                        rules={[{ required: true, message: 'Please enter title' },
                        { min: 5, message: 'Title must have minimum 5 characters' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Amount (in PLN)"
                        name="amountPln"
                        style={{ marginTop: '20px' }}
                        rules={[{ required: true, message: 'Please enter amount' }]}
                    >
                        <InputNumber style={{ width: '100%'}} precision={2}/>
                    </Form.Item>
                </div>

                <Form.Item className='submitButtonBox'>
                    <Button type="primary" htmlType="submit">
                        Add
                    </Button>
                </Form.Item>

            </Form>
        </>
    )
}

export default observer(ExpenseAdd);