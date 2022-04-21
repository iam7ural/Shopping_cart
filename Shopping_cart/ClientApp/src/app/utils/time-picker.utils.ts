import { Injectable } from '@angular/core';
import { NgbTimeAdapter, NgbTimepicker, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable({
  providedIn: 'root'
})
export class CustomTimeAdapter extends NgbTimeAdapter<string> {

  readonly DELIMITER = ':';

  fromModel(value: string | null): NgbTimeStruct | null {
    if (value) {
      const time = value.split(this.DELIMITER);

      return {
        hour: parseInt(time[0],10),
        minute: parseInt(time[1],10),
        second: parseInt(time[2],10),
      };
    }
    return null;
  }

  toModel(time: NgbTimeStruct | null): string | null {
    return time ? time.hour + this.DELIMITER + time.minute + this.DELIMITER + time.second: null;
  }
}
