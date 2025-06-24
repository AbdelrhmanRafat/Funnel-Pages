// 🆕 Helper function to detect if the OTHER option has colors
   export function detectColorOption(firstOption: any, secondOption: any): { firstHasColors: boolean, secondHasColors: boolean } {
        let firstHasColors = false;
        let secondHasColors = false;
        
        // Check if first option's available_options contain hex values
        // This means the SECOND option should show colors
        if (firstOption && secondOption) {
            const firstAvailableOptionsHaveHex = firstOption.values.some(option   => {
                if (!option.available_options || !option.available_options[secondOption.key]) return false;
                return option.available_options[secondOption.key].some(item => item.hex && item.hex !== null);
            });
            
            // If first option's available_options have hex, then SECOND option shows colors
            if (firstAvailableOptionsHaveHex) {
                secondHasColors = true;
            }
            
            // Check if second option's available_options contain hex values  
            // This means the FIRST option should show colors
            const secondAvailableOptionsHaveHex = secondOption.values.some(option => {
                if (!option.available_options || !option.available_options[firstOption.key]) return false;
                return option.available_options[firstOption.key].some(item => item.hex && item.hex !== null);
            });
            
            // If second option's available_options have hex, then FIRST option shows colors
            if (secondAvailableOptionsHaveHex) {
                firstHasColors = true;
            }
        }
        
        return { firstHasColors, secondHasColors };
    }

    