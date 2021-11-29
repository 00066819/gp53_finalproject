import { PacmanLoader } from 'react-spinners';

export default function Loading() {
  return (
    <div className="justify-center">
      <PacmanLoader size={48} color='yellow' loading/>
    </div>
  );
}