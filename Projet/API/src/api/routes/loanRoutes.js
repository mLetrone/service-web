module.exports = function (app, loanController) {
    app.route('/loans')
        .get(loanController.getAll.bind(loanController))
        .post(loanController.create.bind(loanController));

    app.route('/loans/:loanID')
        .get(loanController.get.bind(loanController))
        .delete(loanController.delete.bind(loanController));
}
