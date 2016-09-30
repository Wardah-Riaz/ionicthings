import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
 
@Injectable()
export class SalesData {
  data: any;
 
  constructor(private http: Http) {
    this.data = null;
  }
 
  loadSales(){
    if (this.data) {
      console.log("NOT getting from dbbb");
      return Promise.resolve(this.data);
    }
    return new Promise(resolve => {
      console.log("getting from dbbb");
      this.http.get('http://localhost:8080/api/sales').subscribe(res => {
          this.data = res.json();
          resolve(this.data);
        });
    });
  }

  getSales(segment, queryText) {
    return this.loadSales().then(data => {
      data.salesrequired = [];
      queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
      let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
      
      data.forEach(sale => {
          this.filterSale(sale, queryWords, segment);
          if (!sale.hide) {
            data.salesrequired.push(sale);
          }
      });
      return data.salesrequired;
    });
  }

  getSalesOnRefresh(segment, queryText) {
    this.data = null;
    return this.loadSales().then(data => {
      data.salesrequired = [];
      queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
      let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
      
      data.forEach(sale => {
          this.filterSale(sale, queryWords, segment);
          if (!sale.hide) {
            data.salesrequired.push(sale);
          }
      });
      return data.salesrequired;
    });
  }

  filterSale(sale, queryWords, segment) {
    let matchesQueryText = false;
    if (queryWords.length) {
      queryWords.forEach(queryWord => {
        if (sale.name.toLowerCase().indexOf(queryWord) > -1) {
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
    let startdate = new Date(sale.startdate);
    let enddate = new Date(sale.enddate);
    if (startdate > datetoday && enddate > datetoday) {
      sale.status = 'upcoming';
    } else if (startdate <= datetoday && enddate >= datetoday) {
      sale.status = 'ongoing';
      let timeDiff = Math.abs(datetoday.getTime() - startdate.getTime());
      sale.daynum = Math.ceil(timeDiff / (1000 * 3600 * 24));
    } else {
      sale.status = 'none';
      this.deleteSale(sale._id);
    }
    if (sale.status === segment) {
        matchesSegment = true;
    }
    sale.hide = !(matchesQueryText && matchesSegment);
  }


  createSale(sale){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.data.push(sale);
    this.http.post('http://localhost:8080/api/sales', JSON.stringify(sale), {headers: headers})
      .subscribe(res => {
        console.log(res.json());
      });
  }
 
  deleteSale(id){
    this.http.delete('http://localhost:8080/api/sales/' + id).subscribe((res) => {
      console.log(res.json());
    });    
  }
 
}