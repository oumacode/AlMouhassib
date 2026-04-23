import * as ImagePicker from 'expo-image-picker';
import { ImageSource } from '../types/financialDocument';

const imageMediaTypes: ImagePicker.MediaType[] = ['images'];

const cameraOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: imageMediaTypes,
  allowsEditing: true,
  quality: 0.9,
};

const galleryOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: imageMediaTypes,
  allowsEditing: true,
  quality: 0.9,
  selectionLimit: 1,
};

export const requestAcquisitionPermissions = async () => {
  const [cameraPermission, galleryPermission] = await Promise.all([
    ImagePicker.requestCameraPermissionsAsync(),
    ImagePicker.requestMediaLibraryPermissionsAsync(),
  ]);

  return {
    cameraGranted: cameraPermission.granted,
    galleryGranted: galleryPermission.granted,
  };
};

const ensurePermission = async (source: ImageSource) => {
  if (source === 'camera') {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    return permission.granted;
  }

  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return permission.granted;
};

export const acquireImage = async (source: ImageSource): Promise<string | null> => {
  const granted = await ensurePermission(source);

  if (!granted) {
    return null;
  }

  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync(cameraOptions)
      : await ImagePicker.launchImageLibraryAsync(galleryOptions);

  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  return result.assets[0].uri;
};
