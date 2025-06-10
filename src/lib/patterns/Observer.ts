import type { BlockData } from "../api/types";

export type State = Record<string, any>;

export interface Subject<T extends State> {
    attach(observer: Observer<T>): void;
    detach(observer: Observer<T>): void;
    notify(): void;
    getState(): T;
    setState(newState: Partial<T>): void;
}

export interface Observer<T extends State> {
    update(subject: Subject<T>): void;
}

export class GenericSubject<T extends State> implements Subject<T> {
    private observers: Observer<T>[] = [];
    private state: T;

    constructor(initialState: T) {
        this.state = initialState;
    }

    public getState(): T {
        return this.state;
    }

    public setState(newState: Partial<T>): void {
        this.state = { ...this.state, ...newState };
        this.notify();
    }

    public attach(observer: Observer<T>): void {
        const isExist = this.observers.includes(observer);
        if (isExist) {
            return console.log('Subject: Observer has been attached already.');
        }

        this.observers.push(observer);
        observer.update(this);
    }

    public detach(observer: Observer<T>): void {
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex === -1) {
            return console.log('Subject: Nonexistent observer.');
        }

        this.observers.splice(observerIndex, 1);
    }

    public notify(): void {
        for (const observer of this.observers) {
            observer.update(this);
        }
    }
}

export interface QuantityState {
    quantity: number;
    selectedItem: any | null;
}

export class QuantityOptionsSubject extends GenericSubject<QuantityState> {
    private static instance: QuantityOptionsSubject;

    private constructor() {
        super({
            quantity: 1,
            selectedItem: null
        });
        this.initializeQuantityOptions();
    }

    public static getInstance(): QuantityOptionsSubject {
        if (!QuantityOptionsSubject.instance) {
            QuantityOptionsSubject.instance = new QuantityOptionsSubject();
        }
        return QuantityOptionsSubject.instance;
    }

    private initializeQuantityOptions(): void {
        const initialRadio = document.querySelector('input[type="radio"]:checked');
        if (initialRadio) {
            const quantity = parseInt(initialRadio.getAttribute('data-items') || '1');
            const selectedItem = JSON.parse(initialRadio.getAttribute('selected-item') || 'null');
            this.setState({ quantity, selectedItem });
        }

        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                const quantity = parseInt(target.getAttribute('data-items') || '1');
                const selectedItem = JSON.parse(target.getAttribute('selected-item') || 'null');
                this.setState({ quantity, selectedItem });
            });
        });
    }
}