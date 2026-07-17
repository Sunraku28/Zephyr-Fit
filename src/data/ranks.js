import IconSloth from '../components/icons/IconSloth';
import IconBoot from '../components/icons/IconBoot';
import IconRunner from '../components/icons/IconRunner';
import IconBarbell from '../components/icons/IconBarbell';

export const RANKS = [
  { id: 'sedentary', name: 'Sedentary', tier: 'RANK I', desc: 'Low activity, minimal daily movement', Icon: IconSloth },
  { id: 'walker', name: 'Walker', tier: 'RANK II', desc: 'Active daily walking, light stretching', Icon: IconBoot },
  { id: 'athlete', name: 'Athlete', tier: 'RANK III', desc: 'Regular exercise, weight training', Icon: IconRunner },
  { id: 'titan', name: 'Titan', tier: 'RANK IV', desc: 'High-intensity performance training', Icon: IconBarbell },
];