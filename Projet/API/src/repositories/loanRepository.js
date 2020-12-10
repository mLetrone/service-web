
const { v4: uuid } = require('uuid');
const _ = require('lodash');
const ValidationError = require('./validationError');

const checkLoan = function (loan) {
    if (!loan.loanDate) {
        throw new ValidationError('The loan must have a date.');
    }
    if (!loan.userId) {
        throw new ValidationError('The loan must have a user ID.');
    }
    if (!loan.bookId) {
        throw new ValidationError('The loan must have a book ID.');
    }
    if (!loan.copyId) {
        throw new ValidationError('The loan must have a copy ID.');
    }
    
}


class LoanRepository {
    constructor(db, copyRepository) {
        this.db = db;
        this.copyRepository = copyRepository;
    }

    getAll() {

        return this.db.getData("/loans");
    }

    add(loan) {
        checkLoan(loan);
        loan.id = uuid();
        
        const loans = this.getAll();
        const users = this.db.getData("/users");
        
        if(_.find(users, {id: loan.userId}) === undefined){
            throw new ValidationError('This user does not exist.');
        }
        
        const copy = this.copyRepository.get(loan.copyId, loan.bookId);
        if (copy === undefined) {
            throw new ValidationError('This copy does not exist.');
        }

        if (_.some(loans, { copyId: loan.copyId })) {
            throw new ValidationError('This copy is already loaned.');
        }

        this.db.push('/loans[]', loan);

        return loan;
    }

    get(id) {
        const loans = this.getAll();
        return _.find(loans, { id });
    }


    delete(id) {
        const path = this.getIdPath(id);
        if (path != null) {
            this.db.delete(path);
        }

    }


    getIdPath(id) {
        const loans = this.getAll();
        const index = _.findIndex(loans, { id });
        if (index == -1) {
            return null;
        }
        return '/loans[' + index + ']';
    }
}

module.exports = LoanRepository;