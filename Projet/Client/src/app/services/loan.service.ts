import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { BaseHttpService } from './baseHttpService';
import {Loan} from '../model/Loan';

@Injectable()
export class LoanService extends BaseHttpService {
  loan(userId: string, copyId: string, bookId: string, loanDate: string): Observable<void> {
    return this.http
        // trouver les paramètres pour le loan
        .post<void>(`${this.baseUrl}/loans`, {'userId': userId, 'copyId': copyId, 'bookId': bookId, 'loanDate': loanDate} )
      .pipe(
        map(() => null),
        catchError((err) => { console.log(err); return null; })
      );
  }
  getAll(): Observable<Loan[]> {
    return this.http
        .get<Loan[]>(`${this.baseUrl}/loans`);
  }
  return(loanId: string): Observable<Loan> {
    return this.http
        .delete<Loan>(`${this.baseUrl}/loan/${loanId}`);
  }
}