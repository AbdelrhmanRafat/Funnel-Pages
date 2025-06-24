  // 🆕 Updated helper function to detect if either option has colors based on direct hex presence
  export function detectColorOption(
    firstOption: any,
    secondOption: any,
  ): { firstHasColors: boolean; secondHasColors: boolean } {
    let firstHasColors = false;
    let secondHasColors = false;

    // Check if firstOption has any value with hex
    if (firstOption?.values?.length) {
      firstHasColors = firstOption.values.some(
        (option: any) => option.hex && option.hex !== null,
      );
    }

    // Check if secondOption has any value with hex
    if (secondOption?.values?.length) {
      secondHasColors = secondOption.values.some(
        (option: any) => option.hex && option.hex !== null,
      );
    }

    return { firstHasColors, secondHasColors };
  }