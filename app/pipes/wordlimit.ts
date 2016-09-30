import {Pipe} from '@angular/core';
 
@Pipe({
  name: 'wordlimit'
})
export class Wordlimit {
  transform(value, args) {

    let wordCount = value.split(" ").length;
    let newValue = ''; 
    newValue = value.split(" ").splice(0,15).join(" ");
    if (wordCount > 15) {
    	newValue = newValue + '...';
    }
 
    return newValue;
  }
}