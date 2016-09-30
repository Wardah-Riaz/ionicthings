import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';


@Component({
  templateUrl: 'build/pages/collection-detail/collection-detail.html'
})
export class CollectionDetailPage {
  collection: any;

  constructor(public navParams: NavParams) {
    this.collection = navParams.data;
  }
}
