import { useMemo } from 'react';
import { useDeliveryStore } from "../../../../../../../lib/stores/deliveryStore";

interface BaseOffer {
  items: number;
  price_per_item: number;
  total_price: number;
  shipping_price: number;
  discount: number;
  final_total: number;
}

interface UseDeliveryCalculationProps {
  baseOffer: BaseOffer | null;
}

interface UseDeliveryCalculationReturn {
  finalOffer: BaseOffer | null;
}

export const useDeliveryCalculation = ({
  baseOffer,
}: UseDeliveryCalculationProps): UseDeliveryCalculationReturn => {
  const deliveryState = useDeliveryStore();

  const finalOffer = useMemo((): BaseOffer | null => {
    if (!baseOffer) return null;

    let actualShippingCost = 0;
    let actualFinalTotal = baseOffer.final_total;

    // Handle delivery options
    if (deliveryState.selectedDeliveryOptionId === "delivery-pickup") {
      // Pickup delivery - remove shipping costs
      actualShippingCost = 0;
      actualFinalTotal = baseOffer.final_total - baseOffer.shipping_price;
    } else {
      // Regular delivery - include shipping costs
      actualShippingCost = baseOffer.shipping_price;
      actualFinalTotal = baseOffer.final_total;
    }

    return {
      ...baseOffer,
      shipping_price: actualShippingCost,
      final_total: actualFinalTotal,
    };
  }, [baseOffer, deliveryState.selectedDeliveryOptionId]);

  return {
    finalOffer,
  };
};