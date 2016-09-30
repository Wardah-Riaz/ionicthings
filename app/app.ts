import {Component, ViewChild} from '@angular/core';
import {Platform, ionicBootstrap, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {SalesPage} from './pages/sales/sales';
import {TabsPage} from './pages/tabs/tabs';
import {SalesData} from './providers/salesdata/salesdata';
import {CollectionsData} from './providers/collectionsdata/collectionsdata';
 
@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {
@ViewChild(Nav) nav: Nav;
  rootPage: any = TabsPage;
 
  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}
 
ionicBootstrap(MyApp, [SalesData, CollectionsData]);