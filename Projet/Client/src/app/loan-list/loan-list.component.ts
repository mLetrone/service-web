import { Component, OnInit } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Loan } from '../model/Loan';
import { Book } from '../model/book';
import { User } from '../model/user';
import { LoanService } from '../services/loan.service';
import { BookService } from '../services/book.service';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.css']
})
export class LoanListComponent implements OnInit {
  public loans$: Observable<Loan[]>;

  constructor(
    private loanService: LoanService,
    private bookService: BookService,
    private userService: UserService) { }

  ngOnInit(): void { this.init();}

  public init() {
    this.loans$ = this.loanService.getAll()
      .pipe(
        tap(this.addName.bind(this))
      );
  }

  public return(id: string) {
    this.loanService.return(id).subscribe();
  }

private addName(loans: Loan[]){
  for (const loan of loans){
    this.userService.get(loan.userId)
      .pipe(
        tap( (user) => loan.userName = user.name)
      )
      .subscribe();
    this.bookService.get(loan.bookId)
      .pipe(
        tap( (book) => loan.bookName = book.name)
      )
      .subscribe();
  }
}

}
