import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Player, PlayersComponent } from '../players/players.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MoneyComponent } from '../money/money.component';
import { PlayersService } from '../players/players.service';
import { TransactionsService } from '../transactions/transactions.service';
@Component({
  selector: 'app-home',
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
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  playersDataArray: Player[] = [];
  dataSource = new MatTableDataSource<Player>();
  columnsToDisplay = ['fullName', 'division', 'paid', 'balance', 'operation'];
  public defaultSortColumn: string = 'fullName';
  public defaultSortOrder: 'asc' | 'desc' = 'asc';
  private _snackBar = inject(MatSnackBar);

  constructor(
    private playerService: PlayersService,
    private transactionService: TransactionsService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.updateDataSource();
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

  showPlayersDialog(isEditMode: boolean, player?: Player): void {
    if (isEditMode) {
      const dialogRef = this.dialog.open(PlayersComponent, {
        width: '90%',
        data: { player },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.updatePlayerSuccess(result);
        }
      });
    } else {
      const dialogRef = this.dialog.open(PlayersComponent, {
        width: '90%',
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.addPlayerSuccess(result);
        }
      });
    }
  }

  addPlayerSuccess(player: Player): void {
    this.playerService.addPlayer(player).subscribe({
      next: () => {
        openSnackBar(this._snackBar, 'Thêm mới thành công', 'OK');
      },
      error: (err) => {
        console.error('Lỗi:', err);
      },
    });
  }

  updatePlayerSuccess(player: any): void {
    this.playerService
      .updatePlayer(player.id, player)
      .then(() => {
        openSnackBar(this._snackBar, 'Cập nhật thành công', 'OK');
      })
      .catch((error) => {
        console.error('Lỗi khi cập nhật dữ liệu:', error);
      });
  }

  depositToFund(player: any): void {
    const dialogRef = this.dialog.open(MoneyComponent, {
      width: '90%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const paid = parseInt(player.paid ?? 0) + parseInt(result ?? 0);
        player.paid = paid;
        this.updatePlayerSuccess(player);
        this.transactionService;
      }
    });
  }

  deletePlayer(player: any): void {
    console.log('Delete Player:', player);
    // Confirm deletion and remove from data source
  }
}
export function openSnackBar(
  snackBar: MatSnackBar,
  message: string,
  action: string
) {
  snackBar.open(message, action);
}
