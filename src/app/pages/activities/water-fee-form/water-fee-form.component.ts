import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { WaterFee } from '../activities-form/activities-form.component';
import { ActivitiesService } from '../activities.service';

@Component({
  selector: 'app-water-fee-form',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './water-fee-form.component.html',
  styleUrl: './water-fee-form.component.scss',
})
export class WaterFeeFormComponent {
  waterFees: WaterFee[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { playerId: string },
    private dialogRef: MatDialogRef<WaterFeeFormComponent>,
    private service: ActivitiesService
  ) {
    this.service.getWaterFeeByPerson(this.data.playerId).subscribe({
      next: (waterFeeData) => {
        if (waterFeeData.length > 0) {
          localStorage.setItem(
            this.data.playerId,
            JSON.stringify(waterFeeData)
          );
        }
      },
      error: (err) => {
        console.error('Lỗi ', err);
      },
    });

    // Lấy dữ liệu hiện có từ bộ nhớ tạm hoặc khởi tạo mới
    var waterFeeLocal = localStorage.getItem(data.playerId);
    if (waterFeeLocal) {
      this.waterFees = JSON.parse(waterFeeLocal);
    } else {
      this.waterFees = [{ quantity: 0, price: 0 }];
    }
  }

  addFee() {
    this.waterFees.push({ quantity: 0, price: 0 });
  }

  removeFee(index: number) {
    this.waterFees.splice(index, 1);
  }

  save() {
    // Lưu tạm thời vào localStorage
    localStorage.setItem(this.data.playerId, JSON.stringify(this.waterFees));
    this.dialogRef.close(this.waterFees);
  }
  closeDialog() {
    localStorage.clear();
  }
}
