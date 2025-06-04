import { validateApiResponse, ApiResponse, FunnelData } from './validate';

export const fetchFunnelData = async (id: string | number, lang: string = 'ar'): Promise<FunnelData | null> => {
  try {
    console.log(`Fetching funnel data for ID: ${id}, Language: ${lang}`);
    
    // Call our server-side proxy endpoint
    const response = await fetch(`/api/funnel/${id}?lang=${lang}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response text:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, text: ${errorText}`);
    }

    const data = await response.json();
    console.log('Raw API response:', data);
    
    // Process the response directly rather than validating against a schema
    if (data && data.status === 1 && data.code === 200 && data.data) {
      // Extract the product data
      const apiData = data.data;
      
      // Create a normalized data structure directly from API data
      // No hard-coded fallbacks or mock data
      const normalizedData = {
        product: {
          ...apiData.product,
          // Use actual API attachment data for images
          images: apiData.product.attachment ? 
                  apiData.product.attachment.map((img: any) => img.image_path || img.path || '') : 
                  []
        },
        theme: apiData.theme,
        accept_online_payment: apiData.accept_online_payment,
        // Use blocks directly from API
        blocks: apiData.blocks || [],
        // Use purchase options directly from API (IDs are stabilized on the server side)
        purchase_options: apiData.purchase_options || []
      };
      
      return normalizedData as FunnelData;
    } else {
      console.error('API returned error:', data.errors || data.message || 'Unknown error');
      return null;
    }
  } catch (error) {
    console.error('Error fetching funnel data:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    return null;
  }
};

export const submitFunnelOrder = async (
  id: string | number, 
  formData: Record<string, any>, 
  selectedOption: number,
  lang: string = 'ar'
): Promise<any> => {
  try {
    console.log(`Submitting order for funnel ID: ${id}, Option ID: ${selectedOption}`);
    console.log('Form data:', formData);
    
    const payload = {
      funnel_id: id,
      purchase_option_id: selectedOption,
      customer_data: formData
    };
    console.log('Request payload:', payload);
    
    // Call our server-side proxy endpoint
    const response = await fetch(`/api/funnel/submit-order?lang=${lang}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    console.log('Order submission response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response text:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, text: ${errorText}`);
    }

    const responseData = await response.json();
    console.log('Order submission response:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error submitting order:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};
