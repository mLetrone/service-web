import { NgxSmartModalService } from 'ngx-smart-modal';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {formatDate } from '@angular/common';

import { Book } from '../model/book';
import { Copy } from '../model/copy';
import { BookService } from '../services/book.service';
import { LoanService } from '../services/loan.service';
import { CopyService } from '../services/copy.service';
import { UserSelectionCloseEvent } from '../user-selection/user-selection.component';

@Component({
  selector: 'app-book-loan',
  templateUrl: './book-loan.component.html',
  styleUrls: ['./book-loan.component.css']
})
export class BookLoanComponent implements OnInit {
  private bookId: string;
  public book$: Observable<Book>;
  public copies$: Observable<Copy[]>;
  public loanCopyId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private copyService: CopyService,
    private loanService: LoanService,
    private ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
    this.bookId = this.route.snapshot.paramMap.get('bookId');
    this.book$ = this.bookService.get(this.bookId);
    this.copies$ = this.copyService.getAvailable(this.bookId);
  }

  public async loan(copyId: string) {
    this.loanCopyId = copyId;
    this.ngxSmartModalService.getModal('loanModal').open();
  }

  onClosed(event: UserSelectionCloseEvent) {
    this.ngxSmartModalService.getModal('loanModal').close();

    if (event.user && event.isValidated) {
      const date= new Date();
      const dateStr = formatDate(date, 'dd/MM/yyyy hh:mm:ss', 'fr-FR');
      this.loanService.loan( event.user.id,this.loanCopyId, this.bookId, dateStr)
        .pipe(
          tap(() => this.router.navigateByUrl('/users'))
        )
        .subscribe();
    }

    this.loanCopyId = null;
  }
}
