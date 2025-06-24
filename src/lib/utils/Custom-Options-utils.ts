// 🆕 Helper function to detect if either option has colors by checking hex directly
export function detectColorOption(
  firstOption: any,
  secondOption: any
): { firstHasColors: boolean; secondHasColors: boolean } {
  let firstHasColors = false;
  let secondHasColors = false;

  if (firstOption?.values?.length) {
    firstHasColors = firstOption.values.some(
      (option: any) => option.hex && option.hex !== null
    );
  }

  if (secondOption?.values?.length) {
    secondHasColors = secondOption.values.some(
      (option: any) => option.hex && option.hex !== null
    );
  }

  return { firstHasColors, secondHasColors };
}
