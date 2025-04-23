import { Component, Input, OnInit,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-common-modal',
  templateUrl: './common-modal.component.html',
  styleUrls: ['./common-modal.component.scss']
})
export class CommonModalComponent implements OnInit {

  @Input() title: string;
  @Input() job : any;
  @Input() visible: boolean;
  @Input() dynamicWidth: string;
  @Input() closable: boolean;
  @Input() appendTo: string;
  @Output()
  onDialogClose: EventEmitter<any> = new EventEmitter(); 
  @Output() visibleChange = new EventEmitter<boolean>();

  @Output() closeEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onDialogHide(){
    // this.visible = false;
    this.closeEvent.emit();
  }

}
