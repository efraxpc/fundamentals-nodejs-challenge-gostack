import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface ResponseTransactions {
  transactions: Transaction[];
  balance: {
    income: number;
    outcome: number;
    total: number;
  };
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): ResponseTransactions {
    const balance = this.getBalance();
    return {
      transactions: this.transactions,
      balance,
    };
  }

  private getBalance(): Balance {
    const totalIncome = this.transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((prev, cur) => {
        return prev + cur.value;
      }, 0);
    const totalOutcome = this.transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((prev, cur) => {
        return prev + cur.value;
      }, 0);
    return {
      outcome: totalOutcome,
      income: totalIncome,
      total: totalIncome - totalOutcome,
    };
  }

  public create({ title, value, type }: TransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });
    const isValidteOutComing = this.isValidteOutComing(transaction);
    if (!isValidteOutComing) {
      throw Error('Insuficient founds');
    }

    this.transactions.push(transaction);
    return transaction;
  }

  private isValidteOutComing(transaction: Transaction): boolean {
    let isValid = true;
    const balance = this.getBalance();
    if (transaction.type === 'outcome' && transaction.value >= balance.total) {
      isValid = false;
    }
    return isValid;
  }
}

export default TransactionsRepository;
