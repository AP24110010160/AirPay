import { Platform, PermissionsAndroid, Permission } from 'react-native';
import { Camera } from 'expo-camera';

export interface PermissionStatus {
  camera: boolean;
  bluetooth: boolean;
  allGranted: boolean;
}

/**
 * Request Bluetooth permissions (Android only)
 * Shows native permission dialogs directly
 */
export const requestBluetoothPermissions = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    // iOS - Bluetooth permissions are handled automatically
    return true;
  }

  try {
    const androidVersion = Platform.Version as number;
    
    if (androidVersion >= 31) {
      // Android 12+ requires new Bluetooth permissions
      const bluetoothPermissions: Permission[] = [
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ];

      const bluetoothResults = await PermissionsAndroid.requestMultiple(bluetoothPermissions);
      
      // Check if all Bluetooth permissions were granted
      return Object.values(bluetoothResults).every(
        (result) => result === PermissionsAndroid.RESULTS.GRANTED
      );
    } else {
      // Android 11 and below only require ACCESS_FINE_LOCATION at runtime for BLE scanning
      const locationResult = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return locationResult === PermissionsAndroid.RESULTS.GRANTED;
    }
  } catch (error) {
    console.error('Error requesting Bluetooth permissions:', error);
    return false;
  }
};

/**
 * Check current permission status without requesting
 */
export const checkPermissionStatus = async (): Promise<PermissionStatus> => {
  const results: PermissionStatus = {
    camera: false,
    bluetooth: false,
    allGranted: false,
  };

  try {
    // Check camera permission imperatively
    const cameraPermission = await Camera.getCameraPermissionsAsync();
    results.camera = cameraPermission?.granted || false;

    // Check Bluetooth permissions (Android)
    if (Platform.OS === 'android') {
      const androidVersion = Platform.Version as number;
      if (androidVersion >= 31) {
        results.bluetooth = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
        );
      } else {
        results.bluetooth = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
      }
    } else {
      results.bluetooth = true; // iOS handles automatically
    }

    results.allGranted = results.camera && results.bluetooth;

    return results;
  } catch (error) {
    console.error('Error checking permission status:', error);
    return results;
  }
};
