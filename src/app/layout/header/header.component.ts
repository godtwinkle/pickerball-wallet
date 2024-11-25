import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionsService } from '../../pages/transactions/transactions.service';
import {
  ActivitiesFormComponent,
  Activity,
} from '../../pages/activities/activities-form/activities-form.component';

import { MatMenuModule } from '@angular/material/menu';
import { ActivitiesService } from '../../pages/activities/activities.service';
import { openSnackBar } from '../../pages/players/players/players.component';
import { Transaction } from '../../pages/transactions/transactions.component';
import { forkJoin } from 'rxjs';
import { PlayersService } from '../../pages/players/players.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    // MatToolbarModule,
    MatMenuModule,
    MatInputModule,

    MatDialogModule,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private _snackBar = inject(MatSnackBar);
  constructor(
    private transactionsService: TransactionsService,
    private activitiesService: ActivitiesService,
    private playerService: PlayersService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  fieldPayment(): void {
    const dialogRef = this.dialog.open(ActivitiesFormComponent, {
      width: '90%',
      disableClose: false, // Focus sẽ được xử lý tự động
      autoFocus: true, // Đảm bảo focus chuyển đến dialog
      ariaLabel: 'fieldPayment', // Cải thiện Accessibility
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.paymentSuccess(result);
      }
    });
  }

  paymentSuccess(activity: Activity): void {
    const waterFeeTotal = activity.participants.reduce((total, participant) => {
      // Duyệt qua mỗi participant, tính tổng quantity * price cho waterFee
      const participantTotalFee = participant.waterFee.reduce(
        (participantTotal, water) => {
          return participantTotal + water.quantity * water.price;
        },
        0
      );

      // Cộng giá trị participantTotalFee vào waterFee chung
      return total + participantTotalFee;
    }, 0);

    activity.waterFee = waterFeeTotal;
    activity.totalFee = waterFeeTotal + activity.fieldFee;

    this.activitiesService.addActivity(activity).subscribe({
      next: (activityID) => {
        const transactions: Transaction[] = activity.participants.map(
          (participant) => {
            //Tính tổng (price * quantity) trong waterFee
            const waterFeeOfPerson = participant.waterFee
              ? participant.waterFee.reduce(
                  (sum, wf) => sum + wf.price * wf.quantity,
                  0
                )
              : 0;

            //   Tổng số tiền của từng người
            const amount =
              activity.fieldFee / activity.participants.length +
              waterFeeOfPerson;

            this.playerService.getPaidById(participant.id).then((paid) => {
              this.playerService.updatePlayer(participant.id, {
                spent: amount,
                balance: paid - amount,
              });
            });

            return {
              activityID: activityID, // ID của Activity
              playerID: participant.id, // ID của Participant
              amount: amount, // Số tiền được tính toán
              title: activity.title, // Tiêu đề từ Activity
              updatedAt: activity.updatedAt, // Thời gian cập nhật từ Activity
            };
          }
        );

        const transactionRequests = transactions.map((transaction) =>
          this.transactionsService.addTransactions(transaction)
        );

        forkJoin(transactionRequests).subscribe({
          next: () => {
            openSnackBar(this._snackBar, 'Cập nhật giao dịch thành công', 'OK');
          },
          error: (err) => {
            console.error('Lỗi tạo giao dịch', err);
          },
        });
      },
      error: (err) => {
        console.error('Lỗi tính phí', err);
      },
    });
  }

  navigateToPlayer() {
    this.router.navigate(['/players']);
  }
  navigateToActivity() {
    this.router.navigate(['/activities']);
  }
}
