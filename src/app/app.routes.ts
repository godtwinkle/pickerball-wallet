import { Routes } from '@angular/router';
import { PlayersFormComponent } from './pages/players/players-form/players-form.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { ActivitiesFormComponent } from './pages/activities/activities-form/activities-form.component';
import { PlayersComponent } from './pages/players/players/players.component';

export const routes: Routes = [
  { path: '', component: PlayersComponent },
  { path: 'players', component: PlayersComponent },
  { path: 'players-form', component: PlayersFormComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'activities', component: ActivitiesFormComponent },
];
