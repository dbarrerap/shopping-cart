import { inject, Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class ApiService {
    private http = inject(HttpClient)
    private URL_API = environment.apiUrl

    apiCall = (endpoint: string, method: string, data?: any) => {
        const headers = new HttpHeaders({ "Content-Type": "application/json" })
        
        switch (method) {
            case "GET":
                return this.http.get(`${this.URL_API}${endpoint}`);
            case "POST":
                return this.http.post(`${this.URL_API}${endpoint}`, data, { headers })
            default:
                return null;
        }
    }
}