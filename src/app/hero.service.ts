import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';

import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class HeroService {

  
  constructor(
    private messageService: MessageService,
    private http: HttpClient,
    ) { }

    getHeroes (): Observable<Hero[]> {
      return this.http.get<Hero[]>(this.heroesUrl)
        .pipe(
          tap(heroes => this.log('fetched heroes')),
          catchError(this.handleError('getHeroes', []))
        );
    }
    
    // getHero(id: number): Observable<Hero> {
    //   this.messageService.add(`HeroService: fetched hero id=${id}`);
    //   return of(HEROES.find(hero => hero.id === id));
    // }

    getHero(id: number): Observable<Hero> {
      const url = `${this.heroesUrl}/${id}`;
      return this.http.get<Hero>(url).pipe(
        tap(_=> this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<Hero>(`getHeroid=${id}`))
      );
    }

  private log(message: string){this.messageService.add(`HeroService: ${message}`);}
  private heroesUrl = 'api/heroes';
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
   
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
   
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
   
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  
}
