import { useEffect } from "react";

 /**
  * A custom hook for managing volume control during audio recording.
  *
  * This hook calculates and updates the volume percentage based on the current volu
 level,
  * the maximum volume level observed, and the minimum volume level observed during
 the recording session.
  * It sets the volume percentage to 0 when recording is not active.
  *
  * @param {Object} audio - The audio control object with methods for managing audio
 recording.
  * @param {number} currentVolume - The current volume level.
  * @param {Function} setCurrentVolume - Function to update the current volume level
  * @param {Function} setVolumePercentage - Function to update the volume percentage
  * @param {Object} maxVolumeRef - A React ref object pointing to the maximum volume
 level observed.
  * @param {Object} minVolumeRef - A React ref object pointing to the minimum volume
 level observed.
  */
 export const useVolumeControl = (audio, currentVolume, setCurrentVolume,
 setVolumePercentage, maxVolumeRef, minVolumeRef) => {
     useEffect(() => {
         // Reset volume percentage to 0 when recording is not active.
         if (!audio.isRecording) {
             setVolumePercentage(0);
             return;
         }

         // Ensure currentVolume is a valid number before proceeding.
         if (typeof currentVolume === "number" && isFinite(currentVolume)) {
             // Update max and min volume levels observed.
             if (currentVolume > maxVolumeRef.current)
                 maxVolumeRef.current = currentVolume;
             if (currentVolume < minVolumeRef.current)
                 minVolumeRef.current = currentVolume;

             // Calculate and update volume percentage based on observed max and min volume levels.
             if (maxVolumeRef.current !== minVolumeRef.current) {
                 setVolumePercentage(
                     (currentVolume - minVolumeRef.current) /
                     (maxVolumeRef.current - minVolumeRef.current)
                 );
             }
         }
     }, [currentVolume, audio.isRecording]);
 };