import { Component, OnInit } from '@angular/core';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}


@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})


export class PaginationComponent implements OnInit {

  first1: number = 0;

  rows1: number = 10;

  first2: number = 0;

  rows2: number = 10;

  first3: number = 0;

  rows3: number = 10;

  totalRecords: number = 120;

  options = [
      { label: 5, value: 5 },
      { label: 10, value: 10 },
      { label: 20, value: 20 },
      { label: 120, value: 120 }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onPageChange1(event: PageEvent) {
    this.first1 = event.first;
    this.rows1 = event.rows;
  }

  onPageChange2(event: PageEvent) {
      this.first2 = event.first;
      this.rows2 = event.rows;
  }

  onPageChange3(event: PageEvent) {
      this.first3 = event.first;
      this.rows3 = event.rows;
  }
}
