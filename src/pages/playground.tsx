import MovePlayground from '@/components/MovePlayground';

export default function PlaygroundPage() {
  console.log('Rendering PlaygroundPage');
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem'
    }}>
      <h1 style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '2rem'
      }}>
        Move 代码操场
      </h1>
      <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
        <MovePlayground />
      </div>
    </div>
  );
} 