import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-current-rate',
    templateUrl: './current-rate.component.html',
    styleUrls: ['./current-rate.component.css']
})
export class CurrentRateComponent implements OnInit {
    @Input() value;

    public currency = 'EUR';

    constructor() {
    }

    ngOnInit(): void {
    }

}
