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
    private dialog: MatDialog
  ) {}

  updateTransactionSuccess(transactions: any): void {
    // this.service
    //   .updatePlayer(player.id, player)
    //   .then(() => {
    //     openSnackBar(this._snackBar, 'Cập nhật thành công', 'OK');
    //   })
    //   .catch((error) => {
    //     console.error('Lỗi khi cập nhật dữ liệu:', error);
    //   });
  }

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
    this.activitiesService.addActivity(activity).subscribe({
      next: (activityID) => {
        const transactions: Transaction[] = activity.participants.map(
          (participant) => ({
            activityID: activityID, // ID của Activity
            playerID: participant.id, // ID của Participant
            amount: 0, // Giá trị số tiền (mặc định là '0', có thể thay đổi)
            title: activity.title, // Tiêu đề từ Activity
            updatedAt: activity.updatedAt, // Thời gian cập nhật từ Activity
          })
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
}
