import { CommonModule } from '@angular/common';
import { Component, Inject, signal } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDatepickerModule } from '@angular/material/datepicker';

import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
@Component({
  selector: 'app-players',
  standalone: true,
  imports: [
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    // MatToolbarModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatInputModule,
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDatepickerModule,
  ],
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss',
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
})
export class PlayersComponent {
  playerData: Player = {
    fullName: '',
    division: '',
    phone: '',
    paid: 0,
    balance: 0,
    birthday: null,
    spent: 0,
  };

  readonly fullName = new FormControl('', [Validators.required]);
  errorMessage = signal('');
  isEditMode = false;

  constructor(
    public dialogRef: MatDialogRef<PlayersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { player?: Player }
  ) {
    if (data?.player) {
      this.isEditMode = true;
      this.playerData = {
        ...data.player,
        birthday: data.player.birthday
          ? new Date(data.player.birthday.seconds * 1000)
          : null,
      };
    }
    merge(this.fullName.statusChanges, this.fullName.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }
  updateErrorMessage() {
    if (this.fullName.hasError('required')) {
      this.errorMessage.set('Phải nhập giá trị này');
    } else if (this.fullName.hasError('fullName')) {
      this.errorMessage.set('Tên không hợp lệ');
    } else {
      this.errorMessage.set('');
    }
  }
  onCancel(): void {
    this.dialogRef.close();
  }

  onSavePlayer(): void {
    this.dialogRef.close(this.playerData);
  }
}

export interface Player {
  fullName: string;
  division: string;
  paid: number;
  balance: number;
  birthday: any;
  phone: string;
  spent: number;
}
