import { useEffect, useState } from 'react'

import { Observer, observer } from 'mobx-react';
import store from '../stores/store';

import { IExpense } from '../interfaces/interfaces'

import { Button, Table } from 'antd';
import type { TableProps } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import type { SorterResult } from 'antd/lib/table/interface';
import ExpenseAdd from './ExpenseAdd';
import { useQuery } from 'react-query';

const TableObserver = observer(Table);

type Props = {}

function Main({ }: Props): JSX.Element {
    const [sortedInfo, setSortedInfo] = useState<SorterResult<IExpense>>({});

    const { data } = useQuery('eurRate', () =>
        fetch('http://api.nbp.pl/api/exchangerates/rates/a/eur/')
            .then(res => res.json())
            .catch(err => {
                console.log('Unable to fetch exchange rate!', err)
            })
    )

    const euroRate = data?.rates[0]?.mid;

    useEffect(() => {
        euroRate && store.updateEuroAmount(euroRate)
    }, [euroRate])

    const handleChange: TableProps<IExpense>['onChange'] = (pagination: any, filters: any, sorter) => {
        setSortedInfo(sorter as SorterResult<IExpense>);
    };

    const columns: ColumnsType<IExpense> = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: '20%',
            sorter: (a, b) => a.title.length - b.title.length,
            sortOrder: sortedInfo.columnKey === 'title' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Amount (PLN)',
            dataIndex: 'amountPln',
            key: 'amountPln',
            width: '10%',
            sorter: (a, b) => a.amountPln - b.amountPln,
            sortOrder: sortedInfo.columnKey === 'amountPln' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Amount (EUR)',
            dataIndex: 'amountEur',
            key: 'amountEur',
            width: '10%',
            sorter: (a, b) => a.amountEur - b.amountEur,
            sortOrder: sortedInfo.columnKey === 'amountEur' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Options',
            key: 'options',
            dataIndex: 'options',
            width: '10%',
            render: (text, record) => (
                <Button type="text" onClick={() => store.deleteExpense(record.key)}>{"Delete"}</Button>
            )
        }
    ];


    return (
        <Observer>
            {() => (
                <div className='table'>
                    <div className="heading">
                        <h1>List of expenses</h1>
                        {euroRate && <p> 1 EUR = {euroRate} PLN</p>}
                    </div>
                    <ExpenseAdd euroRate={euroRate} />
                    <TableObserver
                        columns={columns}
                        dataSource={store.expenses.slice()}
                        onChange={handleChange}
                        pagination={false}
                    />
                    <div className="sum">
                        <h3>
                            Sum: {(store.expenses.reduce((acc, object) => {
                                return acc + object.amountPln;
                            }, 0)).toFixed(2)
                            } PLN
                            ({Math.round((store.expenses.reduce((acc, object) => {
                                return acc + object.amountPln;
                            }, 0) / euroRate) * 100) / 100 || '...'} EUR)
                        </h3>
                    </div>
                </div>
            )}
        </Observer>
    )
}

export default Main