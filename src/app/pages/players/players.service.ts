import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  addDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { Player } from './players-form/players-form.component';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  firestore = inject(Firestore);
  playersCollection = collection(this.firestore, 'players');

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
