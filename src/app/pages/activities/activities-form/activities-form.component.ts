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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivitiesService } from '../activities.service';
import { PlayersService } from '../../players/players.service';
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
  templateUrl: './activities-form.component.html',
  styleUrl: './activities-form.component.scss',
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
})
export class ActivitiesFormComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  playersDataArray: PlayerFee[] = [];
  dataSource = new MatTableDataSource<PlayerFee>();
  columnsToDisplay = ['fullName', 'waterFee'];
  public defaultSortColumn: string = 'fullName';
  public defaultSortOrder: 'asc' | 'desc' = 'asc';
  activity: Activity = {
    participants: [],
    playDay: null,
    updatedAt: null,
    title: '',
    totalFee: 0,
  };

  constructor(
    public dialogRef: MatDialogRef<ActivitiesFormComponent>,
    public service: ActivitiesService,
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
    // this.service.getParticipants().subscribe({
    //   next: (data) => {
    //     this.playersDataArray = data;
    //     this.dataSource = new MatTableDataSource<PlayerFee>(
    //       this.playersDataArray
    //     );
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    //   complete: () => {
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    //     this.dataSource.filterPredicate = function (
    //       data,
    //       filter: string
    //     ): boolean {
    //       return data.fullName.toLowerCase().includes(filter);
    //     };
    //     console.log('Đã cập nhật dữ liệu');
    //   },
    // });
    this.playerService.getPlayers().subscribe({
      next: (data) => {
        this.playersDataArray = data.map((player: any) => ({
          id: player.id,
          fullName: player.fullName,
          waterCount: 0,
        }));

        this.dataSource = new MatTableDataSource<PlayerFee>(
          this.playersDataArray
        );
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

  participate(isChecked: boolean, playerFee: PlayerFee) {
    if (!isChecked) {
      this.activity.participants = this.activity.participants.filter(
        (participant) => participant.id !== playerFee.id
      );
    } else {
      if (
        !this.activity.participants.some(
          (participant) => participant.id === playerFee.id
        )
      ) {
        this.activity.participants.push(playerFee);
      }
    }
  }
}

export interface Activity {
  participants: PlayerFee[];
  playDay: any;
  updatedAt: any;
  title: string;
  totalFee: number;
}

export interface PlayerFee {
  id: string;
  waterCount: number;
  fullName: string;
}
