import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { SalesPage } from '../sales/sales';

import { CollectionsPage } from '../collections/collections';


@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = SalesPage;
  tab2Root: any = CollectionsPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }
}
