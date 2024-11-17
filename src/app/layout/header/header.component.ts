import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionsService } from '../../pages/transactions/transactions.service';
import { ActivitiesComponent } from '../../pages/activities/activities.component';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    // MatToolbarModule,

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
    private service: TransactionsService,
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
    const dialogRef = this.dialog.open(ActivitiesComponent, {
      width: '90%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }
}
