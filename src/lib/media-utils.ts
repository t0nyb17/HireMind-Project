/**
 * Utility functions for handling media device access
 */

export interface MediaError {
  type: 'permission-denied' | 'device-not-found' | 'not-allowed' | 'not-supported' | 'unknown';
  message: string;
  originalError?: Error;
}

export async function checkMediaPermissions(): Promise<{ video: PermissionState | null; audio: PermissionState | null }> {
  if (!navigator.permissions) {
    return { video: null, audio: null };
  }

  try {
    const [videoStatus, audioStatus] = await Promise.all([
      navigator.permissions.query({ name: 'camera' as PermissionName }).catch(() => null),
      navigator.permissions.query({ name: 'microphone' as PermissionName }).catch(() => null),
    ]);

    return {
      video: videoStatus?.state || null,
      audio: audioStatus?.state || null,
    };
  } catch (error) {
    return { video: null, audio: null };
  }
}

export async function requestMediaAccess(): Promise<{ stream: MediaStream; error: null } | { stream: null; error: MediaError }> {
  // Check if mediaDevices is available
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return {
      stream: null,
      error: {
        type: 'not-supported',
        message: 'Your browser does not support camera and microphone access. Please use a modern browser like Chrome, Firefox, or Edge.',
      },
    };
  }

  try {
    // Request media access with specific constraints
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    // Verify we actually got tracks
    const videoTracks = stream.getVideoTracks();
    const audioTracks = stream.getAudioTracks();

    if (videoTracks.length === 0 && audioTracks.length === 0) {
      stream.getTracks().forEach(track => track.stop());
      return {
        stream: null,
        error: {
          type: 'device-not-found',
          message: 'No camera or microphone devices found. Please connect a camera and microphone and try again.',
        },
      };
    }

    return { stream, error: null };
  } catch (error: any) {
    let errorType: MediaError['type'] = 'unknown';
    let message = 'Unable to access camera and microphone.';

    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      errorType = 'permission-denied';
      message = 'Camera and microphone permissions were denied. Please allow access in your browser settings and try again.';
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      errorType = 'device-not-found';
      message = 'No camera or microphone found. Please connect a camera and microphone and try again.';
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      errorType = 'device-not-found';
      message = 'Camera or microphone is being used by another application. Please close other applications using your camera/microphone and try again.';
    } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
      errorType = 'device-not-found';
      message = 'Your camera or microphone does not meet the required specifications. Please try a different device.';
    } else if (error.name === 'NotSupportedError') {
      errorType = 'not-supported';
      message = 'Your browser does not support camera and microphone access. Please use a modern browser.';
    } else {
      message = `Unable to access camera and microphone: ${error.message || 'Unknown error'}. Please check your browser settings and try again.`;
    }

    return {
      stream: null,
      error: {
        type: errorType,
        message,
        originalError: error,
      },
    };
  }
}

export function getDetailedErrorMessage(error: MediaError): string {
  switch (error.type) {
    case 'permission-denied':
      return 'Permission Denied: Please click the camera/microphone icon in your browser\'s address bar and allow access, then refresh the page.';
    case 'device-not-found':
      return 'Device Not Found: Please ensure your camera and microphone are connected and not being used by another application.';
    case 'not-supported':
      return 'Not Supported: Your browser does not support this feature. Please use Chrome, Firefox, or Edge.';
    case 'not-allowed':
      return 'Not Allowed: Camera and microphone access is blocked. Please check your browser settings.';
    default:
      return error.message;
  }
}
