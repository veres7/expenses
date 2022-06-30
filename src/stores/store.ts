import { makeAutoObservable } from 'mobx';
import { IExpense } from '../interfaces/interfaces'
import bigDecimal from 'js-big-decimal';

class Store {
    expenses: IExpense[] = [
        {
            key: '1',
            title: 'New book about Rust',
            amountPln: 100,
            amountEur: 0
        },
        {
            key: '2',
            title: 'Snacks for a football match',
            amountPln: 20,
            amountEur: 0
        },
        {
            key: '3',
            title: 'Bus ticket',
            amountPln: 2.55,
            amountEur: 0
        },
    ];

    constructor() {
        makeAutoObservable(this)
    }

    updateEuroAmount(eurRate: number) {
        const updatedArr: any[] = this.expenses.map(expense => expense.amountEur === 0 ? {...expense, amountEur: (bigDecimal.divide(expense.amountPln, eurRate, 2))} : this.expenses);
        this.expenses = updatedArr;
    }

    addExpense(expense: IExpense) {
        this.expenses.push(expense);
    }

    deleteExpense = (key: string) => {
        const updatedExpenses = this.expenses.filter(expense => expense.key !== key);
        this.expenses = updatedExpenses;
    };
}

const store = new Store();
export default store;