import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
    name: 'jobTitle'
})

export class JobTitlePipe implements PipeTransform{
    transform(value: string, salary: number):string {
        if(salary > 10000){
            return value.toUpperCase();
        }
        else 
            return value;
    }
}