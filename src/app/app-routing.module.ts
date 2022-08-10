import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ManagePersonComponent } from './components/manage-person/manage-person.component';

const routes: Routes = [
  {path:'home',component:HomeComponent},
  {path:'managePerson',component:ManagePersonComponent},
  {path:'managePerson/:id',component:ManagePersonComponent},
  {path:'**',component:HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
