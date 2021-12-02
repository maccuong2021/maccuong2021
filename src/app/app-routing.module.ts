import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//const routes: Routes = [];

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'work',
        loadChildren: () =>
          import('./modules/workflow/workflow.module').then((m) => m.WorkflowModule),
      },     
      {
        path:'',
        redirectTo:'work',
        pathMatch:'full'
      },
      { path: '**', redirectTo: 'error/404' }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { })],
  exports: [RouterModule],
})
export class AppRoutingModule { }