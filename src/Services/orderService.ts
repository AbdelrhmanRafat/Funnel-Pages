// src/services/orderService.ts
import { atom } from 'nanostores';

export const selectedColor = atom<string | null>(null);
export const selectedSize = atom<string | null>(null);

export function setColor(color: string) {
  selectedColor.set(color);
}

export function setSize(size: string) {
  selectedSize.set(size);
}
