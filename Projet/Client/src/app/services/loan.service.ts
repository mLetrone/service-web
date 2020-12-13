import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { BaseHttpService } from './baseHttpService';

@Injectable()
export class LoanService extends BaseHttpService {
  loan(copyId, userId): Observable<void> {
    return this.http
        // trouver les paramètres pour le loan
        .post<void>(`${this.baseUrl}/`,{})
      .pipe(
        map(() => null),
        catchError((err) => { console.log(err); return null; })
      );
  }
}
