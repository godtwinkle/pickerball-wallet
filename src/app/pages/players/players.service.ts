import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  addDoc,
  updateDoc,
  docData,
  getDoc,
  getDocs,
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

  async addPlayer(player: Player): Promise<string> {
    try {
      const response = await addDoc(this.playersCollection, player);
      return response.id;
    } catch (error) {
      console.error('Lỗi khi thêm player:', error);
      throw error;
    }
  }

  async updatePlayer(
    playerId: string,
    playerData: Partial<Player>
  ): Promise<void> {
    try {
      const playerDocRef = doc(this.firestore, `players/${playerId}`);
      await updateDoc(playerDocRef, playerData);
    } catch (error) {
      console.error('Lỗi khi cập nhật player:', error);
      throw error;
    }
  }

  async getPaidById(idDocument: string): Promise<number> {
    try {
      // Lấy document cụ thể
      const docRef = doc(this.firestore, 'players', idDocument);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data()['paid'] as number;
      } else {
        console.error('Document không tồn tại');
        return 0;
      }
    } catch (error) {
      console.error('Lỗi khi lấy document:', error);
      return 0;
    }
  }
  async getSpentById(idDocument: string): Promise<number> {
    try {
      const docRef = doc(this.firestore, 'players', idDocument);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data()['spent'] as number;
      } else {
        console.error('Document không tồn tại');
        return 0;
      }
    } catch (error) {
      console.error('Lỗi khi lấy document:', error);
      return 0;
    }
  }
}
