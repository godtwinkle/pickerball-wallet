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
} from './activities-form/activities-form.component';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesService {
  firestore = inject(Firestore);
  activitiesCollection = collection(this.firestore, 'activities');

  getParticipants(): Observable<PlayerFee[]> {
    return collectionData(this.activitiesCollection, {
      idField: 'id',
    }).pipe(
      map((activities: any[]) => {
        // Lấy tất cả participants từ các hoạt động
        return activities.flatMap((activity) =>
          activity.participants.map((participant: any) => ({
            id: participant.id,
            fullName: participant.fullName,
            waterCount: participant.waterCount || 0, // Gán mặc định waterCount = 0 nếu không có
          }))
        );
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
