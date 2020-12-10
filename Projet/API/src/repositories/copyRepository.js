
const { v4: uuid } = require('uuid');
const _ = require('lodash');
const ValidationError = require('./validationError');

const checkSubmission = function (book) {
    if (!book.submissionDate) {
        throw new ValidationError('The copie must have a submission date.');
    }
}


class CopyRepository {
    constructor(db, bookRepository) {
        this.db = db;
        this.bookRepository = bookRepository;
    }

    getAll(bookId) {
        const bookPath = this.bookRepository.getIdPath(bookId);
        if (bookPath == null) {
            throw new ValidationError('This book does not exists')
        }

        return this.db.getData(bookPath + '/copies');
    }

    add(copie, bookId) {
        checkSubmission(copie);
        copie.id = uuid();
        const bookPath = this.bookRepository.getIdPath(bookId);
        this.db.push(bookPath+'/copies', copie);

        return copie;
    }

    get(id, bookId) {
        const book = this.bookRepository.get(bookId);
        return _.find(book.copies, { id });
    }

    update(id, copie, bookId) {
        if (copie.id !== id) {
            throw new ValidationError('You cannot change the identifier.');
        }

        checkSubmission(copie);
        const path = this.getIdPath(bookId, id);
        if (path == null) {
            throw new ValidationError('This copie does not exists');
        }

        this.db.push(path, copie);

        return book;
    }

    delete(id, bookId) {
        const path = this.getIdPath(bookId, id);
        if (path != null) {
            this.db.delete(path);
        }

    }

    
    getIdPath(bookId, id) {
        const copies = this.getAll(bookId);
        const index = _.findIndex(copies, { id });
        if (index == -1) {
            return null;
        }

        const bookPath = this.bookRepository.getIdPath(bookId);
        return bookPath +'/copies[' + index + ']';
    }
}

module.exports = CopyRepository;