import { NgForOf } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Host, Input, NgModule, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import "@bryntum/calendar/calendar.material.css";
import { Store, StoreConfig, ModelConfig, Grid } from '@bryntum/calendar';
import { BryntumCalendarComponent } from '@bryntum/calendar-angular';
import { Calendar, DateHelper, EventModel, EventStore } from '@bryntum/calendar/calendar.lite.umd.js';
import { calendarConfig } from './workflow.config';
import { FormArray } from '@angular/forms';
import { BryntumTaskBoardComponent } from '@bryntum/taskboard-angular/lib/bryntum-task-board.component';
import { TaskBoard } from '@bryntum/taskboard/taskboard.lite.umd.js';



@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
}) 

export class WorkflowComponent implements OnInit, AfterViewInit {   
  _propertyName: string = "";
  fullName: string = "";
  id: string = "";
  ext: string = "";
  user: any;  
  closeResult = '';
  editingRecord = null;
  newStartDate: any;
  newEndDate: any;
 // Mustache = require('mustache');
     
  @Output() eventShow = new EventEmitter<boolean>();
    
  constructor(
    private domSanitizer: DomSanitizer,   
    private modalService: NgbModal,   
    private changeDetectorRef: ChangeDetectorRef) {
  }
  @ViewChild('contentPopup') contentPopup;
  ngOnInit(): void {
         
  } 

  @ViewChild(BryntumTaskBoardComponent, { static : false }) taskboardComponent: BryntumTaskBoardComponent;
  // @ViewChild(BryntumCalendarComponent) calendarComponent: BryntumCalendarComponent;
    taskboard: TaskBoard;
    private calendar: Calendar;
    private eventStore: EventStore;
   
    // calendar configuration
    calendarConfig = calendarConfig;

    filterTriggers = {
        filter : {
            align : 'start',
            cls   : 'b-fa b-fa-filter'
        }
    };

    highlightTriggers = {
        filter : {
            align : 'start',
            cls   : 'b-fa b-fa-highlighter'
        }
    };
   
    
    /**
     * Find by name text field change handler
     */
    onFindChange({ value }: any): void {
        // We filter using a RegExp, so quote significant characters
        const val = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // A filter with an id replaces any previous filter with that id.
        // Leave any other filters which may be in use in place.
        this.calendar.eventStore.filter({
            id       : 'eventNameFilter',
            filterBy : (event: EventModel) => event.name.match(new RegExp(val, 'i'))
        });
    }

    private getDismissReason(reason: any): string {       
    
        if (reason === ModalDismissReasons.ESC) {
          return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
          return 'by clicking on a backdrop';
        } else {
          return `with: ${reason}`;
        }
      } 

    openDialog(content, size: string = "") {     
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: size, windowClass: 'custom-class' }).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    
        // return this.modalService.open(content, {
        //   size: 'lg',
        //   backdrop: 'static',
        //   keyboard: false,
        //   windowClass : 'modal-content'
        // });
  
        // const modalBackdrop = document.getElementsByTagName('ngb-modal-backdrop');
        // // check the class if exists
        // modalBackdrop[0].className = 'modal-backdrop fade show';
        
        // const modalWindow = document.getElementsByTagName('ngb-modal-window');
        // // check the class if exists
        // modalWindow[0].className = 'modal fade show d-block';
        // modalWindow[0].setAttribute('aria-modal', 'true');
        // modalWindow[0].children[0].className = 'modal-dialog modal-s';

      }
 
    SaveData(modal) {      
      // var date = this.newStartDate;
      // var name = '123';
      // this.editingRecord.eventRecord.data.startDate = this.newStartDate;
      // this.editingRecord.eventRecord.data.endDate = this.newEndDate;     
      // this.editingRecord.eventRecord.data.name  =  '123';     
      // this.editingRecord.isCreating = false;  
     
      this.changeDetectorRef.detectChanges();
      modal.dismiss();
    }

    beforeEventEdit(event): boolean {
        // const
        //     { eventRecord, resourceRecord, eventEdit } = event,
        //     editorConfig = new MatDialogConfig();
            
        // Object.assign(editorConfig, {
        //     disableClose : false,
        //     autoFocus    : true,
        //     width        : '500px',
        //     data         : {
        //         eventRecord,
        //         resourceRecord,
        //         eventStore : eventEdit.eventStore
        //     }
        // });

        //$('#name').val(eventRecord.name);
       // $('#startDate').val(DateHelper.format(eventRecord.startDate, 'YYYY-MM-DD'));

     // originalData
     
        this.editingRecord = event;
        this.editingRecord.eventRecord.data.name  =  '';
        this.editingRecord.eventRecord.originalData.name  =  '';
        this.editingRecord.isCreating = true;
        this.newEndDate = event.eventRecord.data.endDate;
        this.newStartDate = event.eventRecord.data.startDate;//DateHelper.format(event.eventRecord.data.startDate, 'YYYY-MM-DD');//event.eventRecord.data.startDate;
        //this.c
        this.openDialog(this.contentPopup);
        return false;
    }
    
   
    /**
     * Highlight text field change handler
     */
    onHighlightChange({ value }: any): void {
        const
            val = value.toLowerCase(),
            { eventStore, calendar } = this;

        // Calendars refresh on any data change so suspend that.
        // We will trigger the store's change event when we're done.
        eventStore.suspendEvents();

        // Loop through all events in the store
        eventStore.forEach((task) => {
            // The cls field is a DomClassList with add and remove methods
            if (val !== '' && task.name.toLowerCase().includes(val)) {
                task.cls.add('b-match');
            }
            else {
                task.cls.remove('b-match');
            }
        });
        eventStore.resumeEvents();
        
        // Announce that data has changed which will refresh UIs.
        eventStore.trigger('change');

        calendar.element.classList[value.length > 0 ? 'add' : 'remove']('b-highlighting');
    }

    syncData({ store, action, records } : { store : Store; action : String; records : any[]}) : void {
      debugger;
      console.log(`${store.id} changed. The action was: ${action}. Changed records: `, records);
      // Your sync data logic comes here
      this.openDialog(this.contentPopup);
  }
  
    /**
     * Called after View is initialized
     */
    ngAfterViewInit(): void {      
        //  this.calendar = this.calendarComponent.instance;
        //  this.eventStore = this.calendar.eventStore;
        //  this.calendar.on('beforeEventEdit', this.beforeEventEdit.bind(this));
    }
    
    onCalendarCellClick1(e : {[key:string] : any}) : void {
      //  alert(1);
        console.log('onCellClick', e);
    }

    onCalendarCellClick(e : {[key:string] : any}) : void {
        alert(1);
        //console.log('onCellClick', e);
    }


    onCalendarEvents(event: Record<string, any>): void {        
       alert(1);
        // Uncomment the code in this method to start "logging" events
        switch (event.type) {
            case 'beforeEventEdit':
              alert(9);
               break;
            case 'daterangechange':
                break;
            case 'aftereventsave':
               // alert(1);
                console.log(`New event saved: ${event.eventRecord.name}`);
                break;        
            case 'beforeeventdelete':
                //alert(2);
                console.log(`Events removed: ${event.eventRecords.map(eventRecord => eventRecord.name).join(',')}`);
                break;
        }
    }


}