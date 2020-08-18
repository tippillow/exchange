import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, of} from "rxjs";
import {RateSources} from "../../config/enums/rate-sources.enum";
import * as parser from 'fast-xml-parser';
import {catchError, retry} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class CurrentRateService {

    private sources = Object.keys(RateSources).map((source: string) => RateSources[source]);
    private priorityOfResource = 0;
    private _currentRate$ = new BehaviorSubject<number>(null);
    private _actualTime$ = new BehaviorSubject<string>(null);

    constructor(private http: HttpClient) {
    }

    public getActualTime(): string {
        const date = new Date();

        return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:` +
            `${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:` +
            `${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`
    }

    public isJson(str): boolean {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    public get currentRate$(): Observable<number> {
        return this._currentRate$.asObservable();
    }

    public get actualTime$(): Observable<string> {
        return this._actualTime$.asObservable();
    }

    public getCurrentRate$<T>(priorityOfResource: number = 0): any {
        return this.http.get<T>(this.sources[priorityOfResource], {responseType: 'text' as 'json'})
            .pipe(
                catchError(() => {
                    this.getCurrentRate$(++this.priorityOfResource);
                    return of(false);
                }),
                retry(3),
            ).subscribe((responseData: any) => {
                if (responseData) {
                    this._currentRate$.next(this.parserXMLToJSON(responseData));
                    this._actualTime$.next(this.getActualTime())
                    this.priorityOfResource = 0;
                }
            });
    }

    public parserXMLToJSON(responseData: any): number {
        const options = {
            attributeNamePrefix: "",
            attrNodeName: "attr", //default is 'false'
            textNodeName: "#text",
            ignoreAttributes: false,
            ignoreNameSpace: false,
            allowBooleanAttributes: false,
            parseNodeValue: true,
            parseAttributeValue: false,
            trimValues: true,
            cdataTagName: "__cdata", //default is 'false'
            cdataPositionChar: "\\c",
            parseTrueNumberOnly: false,
            arrayMode: false, //"strict"
            stopNodes: ["parse-me-as-string"]
        };


        if (!this.isJson(responseData)) {

            const tObj = parser.getTraversalObj(responseData, options);
            const jsonObj = parser.convertToJson(tObj, options);

            return parseFloat(jsonObj['gesmes:Envelope'].Cube.Cube.Cube.find(currency =>
                currency.attr.currency === 'RUB').attr.rate);
        } else {
            return JSON.parse(responseData).Valute.EUR.Value
        }


    }
}
