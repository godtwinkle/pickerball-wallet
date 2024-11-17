import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PlayersComponent } from './pages/players/players.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { ActivitiesComponent } from './pages/activities/activities.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'players', component: PlayersComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'activities', component: ActivitiesComponent },
];
