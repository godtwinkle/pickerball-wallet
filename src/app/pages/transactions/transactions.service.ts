import { inject, Injectable } from '@angular/core';
import { collection, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  firestore = inject(Firestore);
  playersCollection = collection(this.firestore, 'transactions');

  getPlayers(): Observable<Player[]> {
    return collectionData(this.playersCollection, {
      idField: 'id',
    }) as Observable<Player[]>;
  }

  addPlayer(player: Player): Observable<string> {
    const promise = addDoc(this.playersCollection, player).then(
      (response) => response.id
    );

    return from(promise);
  }

  updatePlayer(playerId: string, playerData: Partial<Player>): Promise<void> {
    const playerDocRef = doc(this.firestore, `players/${playerId}`);
    return updateDoc(playerDocRef, playerData);
  }
}
