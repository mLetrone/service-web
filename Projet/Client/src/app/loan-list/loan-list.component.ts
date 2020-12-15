import { Component, OnInit } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Loan } from '../model/Loan';
import { LoanService } from '../services/loan.service';


@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.css']
})
export class LoanListComponent implements OnInit {
  public loans$: Observable<Loan[]>;

  constructor(private loanService: LoanService) { }

  ngOnInit(): void { this.init();}

  public init() {
    this.loans$ = this.loanService.getAll()
          .subscribe();
  }

}
