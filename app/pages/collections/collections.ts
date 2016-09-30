import {Component} from "@angular/core";
import {NavController, ModalController, App} from 'ionic-angular';
import {AddSalePage} from '../add-sale/add-sale';
import {AddCollectionPage} from '../add-collection/add-collection';
import {SaleDetailPage} from '../sale-detail/sale-detail';
import {CollectionDetailPage} from '../collection-detail/collection-detail';
import {CollectionsData} from '../../providers/collectionsdata/collectionsdata';
import {SalesData} from '../../providers/salesdata/salesdata';
import {Wordlimit} from '../../pipes/wordlimit';
 
@Component({
  templateUrl: 'build/pages/collections/collections.html',
  pipes: [Wordlimit]
})
export class CollectionsPage {

    collections: any; 
    segment = 'ongoing';
    queryText = '';
    constructor(
        private nav: NavController,
        private collectionService: CollectionsData,
        private modalCtrl: ModalController,
        public app: App
    ) {
    }
    
    ionViewDidEnter() {
        this.app.setTitle('Collections');
    }


    ngAfterViewInit() {
        this.updateCollections();
    }

    doRefresh(refresher) {
        console.log('Begin async operation', refresher);

        setTimeout(() => {
            this.collectionService.getCollectionsOnRefresh(this.segment, this.queryText).then((data) => {
                // console.log(data);
                this.collections = data;
            });
            refresher.complete();
        }, 2000);
    }
 
    updateCollections() {
        this.collectionService.getCollections(this.segment, this.queryText).then((data) => {
            console.log(data);
            this.collections = data;
        });
    }

    goToCollectionDetail(collectionData) {
        this.nav.push(CollectionDetailPage, collectionData);
    }

    addCollection(){
        let modal = this.modalCtrl.create(AddCollectionPage);
        modal.onDidDismiss(collection => {
            if(collection){
                this.collectionService.filterCollection(collection, '', this.segment);
                if (!collection.hide) {
                    this.collections.push(collection);
                }
                this.collectionService.createCollection(collection);                
            }
        });
        modal.present();
    }

    deleteCollection(collection){
        //Remove locally
        let index = this.collections.indexOf(collection);
 
        if(index > -1){
          this.collections.splice(index, 1);
        }       
        //Remove from database
        this.collectionService.deleteCollection(collection._id);
    }
}