import { CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WorkflowComponent } from './workflow.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BryntumCalendarModule } from '@bryntum/calendar-angular';
import { AppComponent } from '../../app.component';
import { IConfig } from 'ngx-mask';
import { BryntumTaskBoardModule } from '@bryntum/taskboard-angular';


const maskConfig: Partial<IConfig> = {
  validation: false,
};


const routes: Routes = [
  {
    path: '',
    component: WorkflowComponent,
    children: [
      {
        path: '',
        redirectTo: 'work',
        pathMatch: 'full'
      },
      { path: '**', redirectTo: 'error/404' }
    ]
  },
]; 
/*
@NgModule({
    declarations : [AppComponent],
    imports      : [BrowserModule, BryntumCalendarModule, FormsModule],
    providers    : [],
    bootstrap    : [AppComponent]
}) 
*/
@NgModule({
  providers: [],
  entryComponents: [],
  bootstrap: [AppComponent],
  declarations: [   
    WorkflowComponent   
  ], 
  imports: [  
   // BrowserModule, 
    BryntumCalendarModule, 
    BryntumTaskBoardModule,
    FormsModule,
    CommonModule,
    RouterModule.forChild(routes),   
    FormsModule    
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class WorkflowModule {
  constructor(injector: Injector) {
    // convert Angular Component to Custom Element and register it with browser
    // customElements.define('color-renderer', createCustomElement(ColorRendererComponent, { injector }));
  }
}
