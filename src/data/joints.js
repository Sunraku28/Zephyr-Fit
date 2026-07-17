export const JOINTS = [
  { id: 'neck', label: 'Neck', constraintId: 'neck_strain', badge: 'NECK STRAIN', view: 'front', cx: 90, cy: 52, exclude: ['Overhead Press', 'Neck Bridges'] },
  { id: 'shoulder_left', label: 'Left Shoulder', constraintId: 'left_shoulder_pain', badge: 'LEFT SHOULDER PAIN', view: 'front', cx: 63, cy: 82, exclude: ['Overhead Press', 'Push-ups'] },
  { id: 'shoulder_right', label: 'Right Shoulder', constraintId: 'right_shoulder_pain', badge: 'RIGHT SHOULDER PAIN', view: 'front', cx: 117, cy: 82, exclude: ['Overhead Press', 'Push-ups'] },
  { id: 'hip_left', label: 'Left Hip', constraintId: 'left_hip_tightness', badge: 'LEFT HIP TIGHTNESS', view: 'front', cx: 76, cy: 200, exclude: ['Lunges', 'Deep Squats'] },
  { id: 'hip_right', label: 'Right Hip', constraintId: 'right_hip_tightness', badge: 'RIGHT HIP TIGHTNESS', view: 'front', cx: 104, cy: 200, exclude: ['Lunges', 'Deep Squats'] },
  { id: 'knee_left', label: 'Left Knee', constraintId: 'left_knee_pain', badge: 'LEFT KNEE PAIN', view: 'front', cx: 73, cy: 288, exclude: ['Squats', 'Lunges', 'Deadlifts'] },
  { id: 'knee_right', label: 'Right Knee', constraintId: 'right_knee_pain', badge: 'RIGHT KNEE PAIN', view: 'front', cx: 107, cy: 288, exclude: ['Squats', 'Lunges', 'Deadlifts'] },
  { id: 'ankle_left', label: 'Left Ankle', constraintId: 'left_ankle_instability', badge: 'LEFT ANKLE INSTABILITY', view: 'front', cx: 74, cy: 362, exclude: ['Jump Rope', 'Box Jumps'] },
  { id: 'ankle_right', label: 'Right Ankle', constraintId: 'right_ankle_instability', badge: 'RIGHT ANKLE INSTABILITY', view: 'front', cx: 106, cy: 362, exclude: ['Jump Rope', 'Box Jumps'] },
  { id: 'lower_back', label: 'Lower Back', constraintId: 'lower_back_stiffness', badge: 'LOWER BACK STIFFNESS', view: 'back', cx: 250, cy: 168, exclude: ['Deadlifts', 'Squats', 'Bent-Over Rows'] },
];