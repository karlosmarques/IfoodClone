import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function TrocarSenha({ onBackToLogin }) {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!novaSenha.trim() || !confirmSenha.trim()) {
      setError('Preencha todos os campos.');
      return;
    }

    if (novaSenha !== confirmSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8081/auth/trocar-senha', {
        novaSenha: novaSenha,
      });

      setSuccess(true);
      console.log('Senha atualizada:', response.data);
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Erro ao atualizar a senha.');
      } else if (err.request) {
        setError('Erro de conexão com o servidor.');
      } else {
        setError('Erro inesperado.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col className="d-flex justify-content-center">
          <Card className="forgot-password-card">
            <Card.Body className="p-5">
              <h2 className="text-center mb-4">Trocar Senha</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              {success ? (
                <div className="alert alert-success text-center">
                  Senha atualizada com sucesso! Você já pode fazer login.
                </div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nova senha</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Digite a nova senha"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Confirmar senha</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirme a nova senha"
                      value={confirmSenha}
                      onChange={(e) => setConfirmSenha(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <div className="d-grid mb-3">
                    <Button type="submit" variant="danger" size="lg" disabled={loading}>
                      {loading ? 'Atualizando...' : 'Atualizar senha'}
                    </Button>
                  </div>
                </Form>
              )}

              <div className="text-center">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onBackToLogin) onBackToLogin();
                  }}
                >
                  Voltar para o login
                </a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style>{`
        .forgot-password-card {
          width: 90%;
          max-width: 700px; /* Agora é bem maior */
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }
        .forgot-password-card .p-5 {
          padding: 4rem !important; /* Mais espaço interno */
        }
        .alert {
          border-radius: 8px;
        }
        a {
          color: #ea1d2c;
          text-decoration: none;
          font-weight: 500;
        }
        a:hover {
          text-decoration: underline;
        }
        @media (max-width: 768px) {
          .forgot-password-card {
            width: 95%;
            padding: 2rem;
          }
        }
      `}</style>
    </Container>
  );
}
