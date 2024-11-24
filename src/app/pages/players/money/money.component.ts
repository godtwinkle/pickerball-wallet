import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-money',
  standalone: true,
  imports: [MatButtonModule, MatInputModule, MatDialogModule, FormsModule],
  templateUrl: './money.component.html',
  styleUrl: './money.component.scss',
})
export class MoneyComponent {
  money: number = 0;

  constructor(public dialogRef: MatDialogRef<MoneyComponent>) {}
  onCancel(): void {
    this.dialogRef.close();
  }

  onDepositToFund(): void {
    this.dialogRef.close(this.money);
  }
}
