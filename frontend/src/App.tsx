import MyMapComponent from '@/components/test.tsx';
import CreateRoomForm from '@/components/forms/CreateRoomForm.tsx';

function App() {
  return (
    <>
      <CreateRoomForm onSuccess={(id) => console.log(id)} />
    </>
  );
}

export default App;
