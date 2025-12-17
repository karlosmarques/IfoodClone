import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';



export default function EsqueceuSenha({ onBackToLogin }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validação simples
    if (!email.trim()) {
      setError('Informe seu e-mail');
      return;
    }

    if (!email.includes('@')) {
      setError('E-mail inválido');
      return;
    }

    setLoading(true);

    try {
      const resetRequest = { email };

      await axios.post(
        `http://localhost:8081/auth/esqueceu-senha`,
        resetRequest
      );

      // Segurança: sempre sucesso
      setSuccess(true);

    } catch (err) {
      setError('Erro ao enviar e-mail de recuperação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="forgot-password-container">
      <Row className="h-100">

        {/* Lado Esquerdo */}
        <Col md={6} className="left-panel d-none d-md-flex">
          <div className="left-content">
            <div className="logo-section">
              <h1 className="logo-text">iFood</h1>
            </div>

            <div className="content-section">
              <h2 className="title">Recupere sua senha</h2>
              <p className="subtitle">
                Não se preocupe! Vamos te ajudar a recuperar o acesso à sua conta
              </p>

              <div className="features">
                <div className="feature-item">🔐 Recuperação segura</div>
                <div className="feature-item">📧 E-mail de recuperação</div>
                <div className="feature-item">⚡ Processo rápido e fácil</div>
              </div>
            </div>
          </div>
        </Col>

        {/* Lado Direito */}
        <Col md={6} className="right-panel d-flex align-items-center justify-content-center">
          <Card className="forgot-password-card">
            <Card.Body className="p-4">

              <div className="text-center mb-4">
                <h2 className="forgot-password-title">Esqueceu sua senha?</h2>
                <p className="forgot-password-subtitle">
                  {success
                    ? 'Verifique sua caixa de entrada'
                    : 'Digite seu e-mail e enviaremos um link para redefinir sua senha'}
                </p>
              </div>

              {error && (
                <div className="alert alert-danger">{error}</div>
              )}

              {success ? (
                <div className="alert alert-success">
                  <strong>E-mail enviado com sucesso!</strong>
                  <p className="mt-2">
                    Se o e-mail <strong>{email}</strong> estiver cadastrado,
                    você receberá um link para redefinir sua senha.
                  </p>

                  <Button
                    variant="outline-secondary"
                    className="mt-3 w-100"
                    onClick={() => {
                      setSuccess(false);
                      setEmail('');
                    }}
                  >
                    Enviar novamente
                  </Button>
                </div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Informe seu e-mail cadastrado"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="danger"
                    size="lg"
                    className="w-100"
                    disabled={loading}
                  >
                    {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                  </Button>
                </Form>
              )}

              <div className="text-center mt-4">
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

      {/* ESTILOS */}
      <style>{`
        .forgot-password-container {
          height: 100vh;
          overflow: hidden;
        }

        .left-panel {
          background: linear-gradient(135deg, #ea1d2c, #c70909);
          color: white;
        }

        .left-content {
          padding: 3rem;
        }

        .logo-text {
          font-size: 3rem;
          font-weight: bold;
        }

        .right-panel {
          background: #f8f9fa;
        }

        .forgot-password-card {
          width: 100%;
          max-width: 450px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
      `}</style>

    </Container>
  );
}
