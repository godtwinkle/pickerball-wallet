import { Component } from '@angular/core';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {}

export interface Transaction {
  activityID: string;
  amount: string;
  description: string;
}
