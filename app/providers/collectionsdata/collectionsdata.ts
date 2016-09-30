import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
 
@Injectable()
export class CollectionsData {
  data: any;
 
  constructor(private http: Http) {
    this.data = null;
  }
 
  loadCollections(){
    if (this.data) {
      return Promise.resolve(this.data);
    }
    return new Promise(resolve => {
      this.http.get('http://localhost:8080/api/collections').subscribe(res => {
          this.data = res.json();
          resolve(this.data);
        });
    });
  }

  getCollections(segment, queryText) {
    return this.loadCollections().then(data => {
      data.collectionsrequired = [];
      queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
      let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
      
      data.forEach(collection => {
          this.filterCollection(collection, queryWords, segment);
          if (!collection.hide) {
            data.collectionsrequired.push(collection);
          }
      });
      return data.collectionsrequired;
    });
  }

  getCollectionsOnRefresh(segment, queryText) {
    this.data = null;
    return this.loadCollections().then(data => {
      data.collectionsrequired = [];
      queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
      let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
      
      data.forEach(collection => {
          this.filterCollection(collection, queryWords, segment);
          if (!collection.hide) {
            data.collectionsrequired.push(collection);
          }
      });
      return data.collectionsrequired;
    });
  }

  filterCollection(collection, queryWords, segment) {
    let matchesQueryText = false;
    if (queryWords.length) {
      queryWords.forEach(queryWord => {
        if (collection.name.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
          console.log("matching"+queryWord);
        }
      });
    } else {
      matchesQueryText = true;
    }
   let matchesSegment = false;
    //find datetoday;
    let datetoday = new Date();
    let startdate = new Date(collection.startdate);
    let enddate = new Date(collection.enddate);
    if (startdate > datetoday && enddate > datetoday) {
      collection.status = 'upcoming';
    } else if (startdate <= datetoday && enddate >= datetoday) {
      collection.status = 'ongoing';
      let timeDiff = Math.abs(datetoday.getTime() - startdate.getTime());
      collection.daynum = Math.ceil(timeDiff / (1000 * 3600 * 24));
    } else {
      collection.status = 'none';
      this.deleteCollection(collection._id);
    }
    if (collection.status === segment) {
        matchesSegment = true;
    }
    collection.hide = !(matchesQueryText && matchesSegment);
  }


  createCollection(collection){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.data.push(collection);
    this.http.post('http://localhost:8080/api/collections', JSON.stringify(collection), {headers: headers})
      .subscribe(res => {
        console.log(res.json());
      });
  }
 
  deleteCollection(id){
    this.http.delete('http://localhost:8080/api/collections/' + id).subscribe((res) => {
      console.log(res.json());
    });    
  }
 
}