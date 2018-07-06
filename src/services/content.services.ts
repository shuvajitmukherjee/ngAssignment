import { Injectable } from '@angular/core';
import { Component, Input } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class contentService {
    private _url: string = '../assets/question.json'
    constructor(private http: Http) {
    }
    getContent() {
        return this.http.get(this._url)
                .map((response:Response) => response.json());
    }

}