import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, DatePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import {
  ActivitiesFormComponent,
  Activity,
} from '../activities-form/activities-form.component';
import { PlayersService } from '../../players/players.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { ActivitiesService } from '../activities.service';
@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    // MatToolbarModule,

    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    CommonModule,
    MatMenuModule,
  ],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss',
})
export class ActivitiesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataArray: Activity[] = [];
  dataSource = new MatTableDataSource<Activity>();
  columnsToDisplay = ['title', 'playDay', 'updatedAt', 'totalFee', 'operation'];
  public defaultSortColumn: string = 'title';
  public defaultSortOrder: 'asc' | 'desc' = 'asc';
  private _snackBar = inject(MatSnackBar);

  constructor(
    private playerService: PlayersService,
    private transactionService: TransactionsService,
    private activityService: ActivitiesService,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.updateDataSource();
  }

  updateDataSource() {
    this.activityService.getActivities().subscribe({
      next: (data) => {
        this.dataArray = data;
        this.dataSource = new MatTableDataSource<Activity>(this.dataArray);
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
          return data.title.toLowerCase().includes(filter);
        };
        console.log('Đã cập nhật dữ liệu');
      },
    });
  }

  onSearch(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchValue.trim().toLowerCase();
  }
  showActivityEdit(activity: Activity) {
    const dialogRef = this.dialog.open(ActivitiesFormComponent, {
      width: '90%',
      disableClose: false, // Focus sẽ được xử lý tự động
      autoFocus: true, // Đảm bảo focus chuyển đến dialog
      ariaLabel: 'fieldPayment', // Cải thiện Accessibility
      data: { activity },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.paymentSuccess(result);
      }
    });
  }
}
