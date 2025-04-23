import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomValidationComponent } from './custom-validation.component';

const routes: Routes = [{ path: '', component: CustomValidationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomValidationRoutingModule { }
