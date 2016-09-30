import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
 
@Component({
  templateUrl: 'build/pages/add-sale/add-sale.html',
})
export class AddSalePage {
  name: any;
  shortname: any;
  title: any;
  description: any;
  startdate: any;
  enddate: any;
  constructor(public view: ViewController) {
 
  }
 
  save(): void {
 
    let sale = {
        name: this.name,
        shortname: this.shortname,
        title: this.title,
        description: this.description,
        startdate: this.startdate,
        enddate: this.enddate
    };
    
    this.view.dismiss(sale);
 
  }
 
  close(): void {
    this.view.dismiss();
  }
}