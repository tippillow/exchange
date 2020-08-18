import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {CurrentRateService} from "./services/current-rate/current-rate.service";
import {interval, Observable, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
    public currentRate$: Observable<number>;
    public actualTime$: Observable<string>;

    private INTERVAL = 10000;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(private currentRateService: CurrentRateService) {
    }

    ngOnInit() {
        this.currentRateService.getCurrentRate$();

        interval(this.INTERVAL)
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(() => this.currentRateService.getCurrentRate$());

        this.currentRate$ = this.currentRateService.currentRate$;
        this.actualTime$ = this.currentRateService.actualTime$;
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
