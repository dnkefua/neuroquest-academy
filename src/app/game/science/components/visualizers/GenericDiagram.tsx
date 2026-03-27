'use client';

interface GenericDiagramProps {
  topic?: string;
}

export default function GenericDiagram({ topic }: GenericDiagramProps) {
  return (
    <div style={{
      width: '100%',
      maxWidth: '500px',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔬</div>
      <div style={{
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#a5b4fc',
        marginBottom: '8px',
        textAlign: 'center',
      }}>
        {topic || 'Science Quest'}
      </div>
      <div style={{
        fontSize: '13px',
        color: '#94a3b8',
        textAlign: 'center',
        maxWidth: '300px',
      }}>
        Explore the concepts and answer questions to master this topic!
      </div>
      <div style={{
        marginTop: '16px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <span style={{ padding: '6px 12px', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '16px', fontSize: '11px', color: '#a5b4fc' }}>
          📚 Learn
        </span>
        <span style={{ padding: '6px 12px', background: 'rgba(34, 197, 94, 0.2)', borderRadius: '16px', fontSize: '11px', color: '#4ade80' }}>
          ✅ Practice
        </span>
        <span style={{ padding: '6px 12px', background: 'rgba(250, 204, 21, 0.2)', borderRadius: '16px', fontSize: '11px', color: '#facc15' }}>
          🏆 Master
        </span>
      </div>
    </div>
  );
}