import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
} from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import {
  Activity,
  PlayerFee,
  WaterFee,
} from './activities-form/activities-form.component';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesService {
  firestore = inject(Firestore);
  activitiesCollection = collection(this.firestore, 'activities');

  getWaterFeeByPerson(playerId: string): Observable<WaterFee[]> {
    return collectionData(this.activitiesCollection, {
      idField: 'id',
    }).pipe(
      map((activities: Activity[]) => {
        // Tìm participant có id trùng với playerId trong tất cả các activity
        const participant = activities
          .flatMap((activity) => activity.participants) // Lấy tất cả participants từ các hoạt động
          .find((p) => p.id === playerId); // Tìm participant với id tương ứng

        // Nếu tìm thấy participant, trả về waterFee của họ, nếu không trả về mảng rỗng
        return participant ? participant.waterFee : [];
      })
    );
  }

  getActivities(): Observable<Activity[]> {
    return collectionData(this.activitiesCollection, {
      idField: 'id',
    }) as Observable<Activity[]>;
  }
  addActivity(activity: Activity): Observable<string> {
    const promise = addDoc(this.activitiesCollection, activity).then(
      (response) => response.id
    );

    return from(promise);
  }
}
