import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddFactoryComponent } from './add-factory.component';

const routes: Routes = [{ path: '', component: AddFactoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddFactoryRoutingModule { }
