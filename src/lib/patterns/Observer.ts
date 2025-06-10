import type { BlockData } from "../api/types";

/**
 * Generic type for the state object
 */
export type State = Record<string, any>;

/**
 * The Subject interface for generic state management
 */
export interface Subject<T extends State> {
    attach(observer: Observer<T>): void;
    detach(observer: Observer<T>): void;
    notify(): void;
    getState(): T;
    setState(newState: Partial<T>): void;
}

/**
 * The Observer interface for state changes
 */
export interface Observer<T extends State> {
    update(subject: Subject<T>): void;
}

/**
 * Generic Subject implementation for state management
 */
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
        // Immediately notify new observer of current state
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

/**
 * Specific implementation for quantity options
 */
export interface QuantityState {
    quantity: number;
    selectedItem: any | null;
}

export class QuantityOptionsSubject extends GenericSubject<QuantityState> {
    constructor() {
        super({
            quantity: 1,
            selectedItem: null
        });
        this.initializeQuantityOptions();
    }

    private initializeQuantityOptions(): void {
        // Initialize with the first selected item
        const initialRadio = document.querySelector('input[type="radio"]:checked');
        if (initialRadio) {
            const quantity = parseInt(initialRadio.getAttribute('data-items') || '1');
            const selectedItem = JSON.parse(initialRadio.getAttribute('selected-item') || 'null');
            this.setState({ quantity, selectedItem });
        }

        // Listen for radio button changes
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

/**
 * Example usage:
 * 
 * // Create a subject with specific state type
 * const quantitySubject = new QuantityOptionsSubject();
 * 
 * // Create an observer
 * class MyObserver implements Observer<QuantityState> {
 *     update(subject: Subject<QuantityState>): void {
 *         const state = subject.getState();
 *         console.log('Quantity:', state.quantity);
 *         console.log('Selected Item:', state.selectedItem);
 *     }
 * }
 * 
 * // Attach observer
 * const observer = new MyObserver();
 * quantitySubject.attach(observer);
 * 
 * // Update state
 * quantitySubject.setState({ quantity: 2 });
 */ 