import { Pipe, PipeTransform } from '@angular/core';
import { Util } from 'src/app/util/Util';

@Pipe({
  name: 'replaceText'
})
export class ReplaceTextPipe implements PipeTransform {

  transform(value: string, original: string, replace: string): unknown {
    return Util.replaceAllStrings(value, original, replace);
  }
}
