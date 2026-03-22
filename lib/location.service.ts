interface GeocodeResult {
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude: number;
  longitude: number;
}

class LocationService {
  /**
   * Get current location using browser's geolocation API
   */
  async getCurrentPosition(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error("User denied the request for Geolocation"));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error("Location information is unavailable"));
              break;
            case error.TIMEOUT:
              reject(new Error("The request to get user location timed out"));
              break;
            default:
              reject(new Error("An unknown error occurred"));
              break;
          }
        },
      );
    });
  }

  /**
   * Reverse geocode coordinates to get address details using fetch API
   */
  async reverseGeocode(lat: number, lng: number): Promise<GeocodeResult> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
      );

      const data = await response.json();

      if (data.status !== "OK" || !data.results || data.results.length === 0) {
        throw new Error("Geocoding failed: " + data.status);
      }

      const result = data.results[0];
      const addressComponents = result.address_components;
      const formattedAddress = result.formatted_address;

      let city = "";
      let state = "";
      let country = "";
      let pincode = "";

      addressComponents.forEach((component: any) => {
        const types = component.types;

        if (types.includes("locality")) {
          city = component.long_name;
        } else if (types.includes("administrative_area_level_1")) {
          state = component.long_name;
        } else if (types.includes("country")) {
          country = component.long_name;
        } else if (types.includes("postal_code")) {
          pincode = component.long_name;
        }
      });

      return {
        address: formattedAddress,
        city,
        state,
        country,
        pincode,
        latitude: lat,
        longitude: lng,
      };
    } catch (error) {
      throw new Error("Failed to geocode location: " + error);
    }
  }

  /**
   * Geocode an address string to get coordinates
   */
  async geocode(address: string): Promise<{ lat: number; lng: number }> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
      );

      const data = await response.json();

      if (data.status !== "OK" || !data.results || data.results.length === 0) {
        throw new Error("Geocoding failed: " + data.status);
      }

      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } catch (error) {
      throw new Error("Failed to geocode address: " + error);
    }
  }

  /**
   * Get current location and return address details
   */
  async getCurrentLocationAddress(): Promise<GeocodeResult> {
    try {
      const position = await this.getCurrentPosition();
      const addressDetails = await this.reverseGeocode(
        position.lat,
        position.lng,
      );
      return addressDetails;
    } catch (error) {
      throw error;
    }
  }
}

const locationService = new LocationService();
export { locationService };
export type { GeocodeResult };
