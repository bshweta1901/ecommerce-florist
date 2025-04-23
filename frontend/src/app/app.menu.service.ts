import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class MenuService {

    private menuSource = new Subject<string>();
    private resetSource = new Subject();

    menuSource$ = this.menuSource.asObservable();
    resetSource$ = this.resetSource.asObservable();

    onMenuStateChange(key: string) {
        this.menuSource.next(key);
    }

    reset() {
        this.resetSource.next();
    }

    private menuValue = new BehaviorSubject<string>('default value');
    menuValue$ = this.menuValue.asObservable();

    updateMenuValue(newValue: string) {
        this.menuValue.next(newValue);
    }
}
