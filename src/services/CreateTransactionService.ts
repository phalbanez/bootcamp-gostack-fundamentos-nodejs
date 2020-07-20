import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction, { CreateTransactionDTO } from '../models/Transaction';

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: CreateTransactionDTO): Transaction {
    if (!title) {
      throw new Error('Title not informed.');
    }

    if (!type || (type !== 'income' && type !== 'outcome')) {
      throw new Error('Invalid informed type.');
    }

    if (!value || value <= 0) {
      throw new Error('Invalid informed value.');
    }

    const { total } = this.transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new Error('You do not have enough balance.');
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
