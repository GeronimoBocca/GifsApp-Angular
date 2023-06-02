import { Gif, SearchResponse } from '../interfaces/gifs.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class GifsService {
    constructor(
        private http: HttpClient) {
        this.loadLocalStorage();
    }

    private apiKey: string = 'fTeAzjw01mfOH2mLXINjPn7khGxIrtzH';
    private serviceUrl: string = 'http://api.giphy.com/v1/gifs';

    public gifsList: Gif[] = [];

    private _tagsHistory: string[] = [];

    get tagsHistory() {
        return [...this._tagsHistory];
    };

    private saveLocalStorage(): void {
        localStorage.setItem('history', JSON.stringify(this._tagsHistory));
    };

    private loadLocalStorage(): void {
        if (!localStorage.getItem('history')) return;
        this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

        // if (this._tagsHistory.length === 0) return;
        // this.searchTag(this._tagsHistory[0])
    }

    private organizeHistory(tag: string) {
        tag = tag.toLowerCase();

        if (this._tagsHistory.includes(tag)) {
            this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag)
        };

        this._tagsHistory.unshift(tag);
        this._tagsHistory = this._tagsHistory.splice(0, 10);
        this.saveLocalStorage();
    };

    searchTag(tag: string): void {
        if (tag.length === 0) return;
        this.organizeHistory(tag);

        const params = new HttpParams()
            .set('api_key', this.apiKey)
            .set('limit', '12')
            .set('q', tag);

        this.http.get<SearchResponse>(`${this.serviceUrl}/search`, { params })
            .subscribe(resp => {
                this.gifsList = resp.data;
        });
    };
};