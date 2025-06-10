import type { BlockData } from "../../../../../../lib/api/types";
import { QuantityOptionsSubject } from '../../../../../../lib/patterns/Observer';

// Initialize the quantity options subject
const quantitySubject = new QuantityOptionsSubject();

// Initialize with the first selected item
document.addEventListener('DOMContentLoaded', () => {
    const initialRadio = document.querySelector('input[type="radio"]:checked');
    if (initialRadio) {
        const items = parseInt(initialRadio.getAttribute('data-items') || '1');
        const selectedItem = initialRadio.getAttribute('selected-item');
        if (selectedItem) {
            quantitySubject.setState({
                quantity: items,
                selectedItem: JSON.parse(selectedItem)
            });
        }
    }

    // Listen for radio button changes
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement;
            const items = parseInt(target.getAttribute('data-items') || '1');
            const selectedItem = target.getAttribute('selected-item');
            if (selectedItem) {
                quantitySubject.setState({
                    quantity: items,
                    selectedItem: JSON.parse(selectedItem)
                });
            }
        });
    });
});

// Export the subject for use in other components
export { quantitySubject };