import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, signal, ViewChild } from '@angular/core';
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
import { Player } from '../players/players.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { PlayersService } from '../players/players.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
@Component({
  selector: 'app-activities',
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
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
  ],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss',
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
})
export class ActivitiesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  playersDataArray: Player[] = [];
  dataSource = new MatTableDataSource<Player>();
  columnsToDisplay = ['fullName', 'waterFee'];
  public defaultSortColumn: string = 'fullName';
  public defaultSortOrder: 'asc' | 'desc' = 'asc';
  totalFee: number = 0;
  activity: Activity = {
    fieldFee: 0,
    participants: [],
    playDay: null,
    updatedAt: null,
    waterFee: 0,
  };

  constructor(
    public dialogRef: MatDialogRef<ActivitiesComponent>,
    public playerService: PlayersService
  ) {}

  ngOnInit(): void {
    this.updateDataSource();
  }
  onCancel(): void {
    this.dialogRef.close();
  }

  onSaveActivity(): void {
    this.dialogRef.close(this.activity);
  }

  updateDataSource() {
    this.playerService.getPlayers().subscribe({
      next: (data) => {
        this.playersDataArray = data;
        this.dataSource = new MatTableDataSource<Player>(this.playersDataArray);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = function (
          data,
          filter: string
        ): boolean {
          return data.fullName.toLowerCase().includes(filter);
        };
        console.log('Đã cập nhật dữ liệu');
      },
    });
  }

  onSearch(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchValue.trim().toLowerCase();
  }

  participate(isChecked: boolean, id: string) {
    if (isChecked) {
      this.activity.participants.push(id);
    } else {
      this.activity.participants = this.activity.participants.filter(
        (x) => x != id
      );
    }
  }
}

export interface Activity {
  fieldFee: number;
  participants: string[];
  playDay: any;
  updatedAt: any;
  waterFee: number;
}
