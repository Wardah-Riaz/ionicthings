import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';


@Component({
  templateUrl: 'build/pages/sale-detail/sale-detail.html'
})
export class SaleDetailPage {
  sale: any;

  constructor(public navParams: NavParams) {
    this.sale = navParams.data;
  }
}
