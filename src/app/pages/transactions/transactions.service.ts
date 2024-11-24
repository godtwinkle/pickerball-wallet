import { inject, Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Transaction } from './transactions.component';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  firestore = inject(Firestore);
  transactionsCollection = collection(this.firestore, 'transactions');

  // getPlayers(): Observable<Player[]> {
  //   return collectionData(this.playersCollection, {
  //     idField: 'id',
  //   }) as Observable<Player[]>;
  // }

  addTransactions(transactions: Transaction): Observable<string> {
    const promise = addDoc(this.transactionsCollection, transactions).then(
      (response) => response.id
    );

    return from(promise);
  }

  // updatePlayer(playerId: string, playerData: Partial<Player>): Promise<void> {
  //   const playerDocRef = doc(this.firestore, `players/${playerId}`);
  //   return updateDoc(playerDocRef, playerData);
  // }
}
