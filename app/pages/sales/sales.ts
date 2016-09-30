import {Component} from "@angular/core";
import {NavController, ModalController, App} from 'ionic-angular';
import {AddSalePage} from '../add-sale/add-sale';
import {SaleDetailPage} from '../sale-detail/sale-detail';
import {SalesData} from '../../providers/salesdata/salesdata';
import {Wordlimit} from '../../pipes/wordlimit';
 
@Component({
  templateUrl: 'build/pages/sales/sales.html',
  pipes: [Wordlimit]
})
export class SalesPage {

    sales: any; 
    datetoday: any; 
    segment = 'ongoing';
    queryText = '';
    constructor(
        private nav: NavController,
        private saleService: SalesData,
        private modalCtrl: ModalController,
        public app: App
    ) {
    }
    
    ionViewDidEnter() {
        this.app.setTitle('Sales');
    }


    ngAfterViewInit() {
        this.updateSales();
    }

    doRefresh(refresher) {
        console.log('Begin async operation', refresher);
        setTimeout(() => {
            this.saleService.getSalesOnRefresh(this.segment, this.queryText).then((data) => {
                // console.log(data);
                this.sales = data;
            });
            refresher.complete();
        }, 2000);
    }
 
    updateSales() {
        this.datetoday = new Date();
        this.saleService.getSales(this.segment, this.queryText).then((data) => {
            // console.log(data);
            this.sales = data;
        });
    }

    goToSaleDetail(saleData) {
        this.nav.push(SaleDetailPage, saleData);
    }

    addSale(){
        let modal = this.modalCtrl.create(AddSalePage);
        modal.onDidDismiss(sale => {
            if(sale){
                this.saleService.filterSale(sale, '', this.segment);
                if (!sale.hide) {
                    this.sales.push(sale);
                }
                this.saleService.createSale(sale);                
            }
        });
        modal.present();
    }

    deleteSale(sale){
        //Remove locally
        let index = this.sales.indexOf(sale); 
        if(index > -1){
          this.sales.splice(index, 1);
        }       
        //Remove from database
        this.saleService.deleteSale(sale._id);
    }
}