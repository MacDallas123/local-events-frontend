import { useNavigate } from "react-router-dom";

const IsForbidden = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8f8f8'
        }}>
            <h1 style={{ fontSize: '6rem', color: '#e74c3c', margin: 0 }}>403</h1>
            <h2 style={{ color: '#333' }}>Accès interdit</h2>
            <p style={{ color: '#666', maxWidth: 400, textAlign: 'center' }}>
                Désolé, vous n&apos;avez pas la permission d&apos;accéder à cette page.
            </p>
            <a href="/" 
            onClick={(e) => { e.preventDefault(); navigate("/"); }}
            style={{
                marginTop: 24,
                padding: '10px 24px',
                background: '#3498db',
                color: '#fff',
                borderRadius: 4,
                textDecoration: 'none'
            }}>
                Retour à l&apos;accueil
            </a>
        </div>
    );
};

export default IsForbidden;