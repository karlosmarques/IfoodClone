import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FormCadastroDonoRest from "../cadastros/FormCadastroDonoRest";
import EsqueceuSenha from "./EsqueceuSenha";

export default function FormLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showCadastro, setShowCadastro] = useState(false);

  /* ================= BLOQUEIA LOGIN SE JÁ ESTIVER LOGADO ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/telaprincipal");
    }
  }, [navigate]);

  /* ================= CONTROLE DE HASH ================= */
  useEffect(() => {
    if (window.location.hash === "#esqueceu-senha") {
      setShowForgotPassword(true);
    }
    if (window.location.hash === "#cadastro") {
      setShowCadastro(true);
    }
  }, []);

  /* ================= LOGIN ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !senha.trim()) {
      setError("Preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      const authenticationRequest = {
        email,
        password: senha,
      };

      const response = await axios.post(
        "http://localhost:8081/auth/login",
        authenticationRequest
      );

      // ✅ SALVA TOKEN ANTES DE QUALQUER NAVEGAÇÃO
      localStorage.setItem("token", response.data.token);

      const id_usuario = response.data.id;
      let restauranteExiste = false;

      try {
        const respRest = await axios.get(
          `http://localhost:8081/restaurante/usuario/${id_usuario}`,
          {
            headers: {
              Authorization: `Bearer ${response.data.token}`,
            },
          }
        );
        restauranteExiste = !!respRest.data;
      } catch {
        restauranteExiste = false;
      }

      if (restauranteExiste) {
        navigate("/telaprincipal");
      } else {
        navigate("/cadastroRest", { state: { id_usuario } });
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setError("Erro ao fazer login. Tente novamente.");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  /* ================= TELAS INTERNAS ================= */
  if (showCadastro) {
    return (
      <FormCadastroDonoRest
        onBackToLogin={() => {
          window.location.hash = "";
          setShowCadastro(false);
        }}
      />
    );
  }

  if (showForgotPassword) {
    return (
      <EsqueceuSenha
        onBackToLogin={() => {
          window.location.hash = "";
          setShowForgotPassword(false);
        }}
      />
    );
  }

  /* ================= TELA ================= */
  return (
    <Container fluid className="login-container">
      <Row className="h-100">
        {/* Lado Esquerdo */}
        <Col md={6} className="left-panel d-none d-md-flex">
          <div className="left-content">
            <div className="logo-section">
              <h1 className="logo-text">iFood</h1>
            </div>
            <div className="content-section">
              <h2 className="title">Venda mais com seu restaurante no iFood</h2>
              <p className="subtitle">
                Clientes a um clique de distância e seu negócio vendendo como nunca
              </p>
              <div className="features">
                <div className="feature-item">
                  <span className="feature-icon">🚀</span>
                  <span>Aumente suas vendas</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📱</span>
                  <span>Gerencie seus pedidos</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💰</span>
                  <span>Receba pagamentos online</span>
                </div>
              </div>
            </div>
          </div>
        </Col>

        {/* Lado Direito */}
        <Col
          md={6}
          className="right-panel d-flex align-items-center justify-content-center"
        >
          <Card className="login-card">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="login-title">Entrar</h2>
                <p className="login-subtitle">
                  Acesse sua conta para continuar
                </p>
              </div>

              {error && (
                <div className="alert alert-danger">{error}</div>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Informe seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    maxLength={100}
                    className="form-control-custom"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    maxLength={100}
                    className="form-control-custom"
                  />
                </Form.Group>

                <div className="d-grid mb-3">
                  <Button
                    type="submit"
                    variant="danger"
                    size="lg"
                    className="login-button"
                    disabled={loading}
                  >
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>
                </div>

                <div className="text-center">
                  <a
                    href="#esqueceu-senha"
                    className="forgot-password-link"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.hash = "#esqueceu-senha";
                      setShowForgotPassword(true);
                    }}
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
              </Form>

              <div className="divider my-4">
                <span>ou</span>
              </div>

              <div className="text-center">
                <p className="signup-text">
                  Não tem uma conta?{" "}
                  <a
                    href="#cadastro"
                    className="signup-link"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.hash = "#cadastro";
                      setShowCadastro(true);
                    }}
                  >
                    Cadastre-se
                  </a>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    
      {/* CSS Styles */}
      <style>{`
        .login-container {
          height: 100vh;
          padding: 0;
          margin: 0;
          overflow: hidden;
        }

        .login-container .row {
          margin: 0;
        }

        /* Lado Esquerdo - Estilo Visual */
        .left-panel {
          background: linear-gradient(135deg, #ea1d2c 0%, #c70909 100%);
          position: relative;
          overflow: hidden;
        }

        .left-panel::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
          opacity: 0.3;
        }

        .left-content {
          position: relative;
          z-index: 1;
          padding: 3rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: white;
        }

        .logo-section {
          margin-bottom: 3rem;
        }

        .logo-text {
          font-size: 3rem;
          font-weight: 700;
          color: white;
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }

        .content-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          color: white;
        }

        .subtitle {
          font-size: 1.2rem;
          margin-bottom: 3rem;
          opacity: 0.95;
          line-height: 1.6;
        }

        .features {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .feature-icon {
          font-size: 1.8rem;
        }

        /* Lado Direito - Formulário */
        .right-panel {
          background: #f8f9fa;
          padding: 2rem;
        }

        .login-card {
          width: 100%;
          max-width: 450px;
          border: none;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          background: white;
        }

        .login-title {
          font-size: 2rem;
          font-weight: 700;
          color: #212529;
          margin-bottom: 0.5rem;
        }

        .login-subtitle {
          color: #6c757d;
          font-size: 0.95rem;
          margin: 0;
        }

        .form-control-custom {
          border-radius: 8px;
          border: 1px solid #dee2e6;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-control-custom:focus {
          border-color: #ea1d2c;
          box-shadow: 0 0 0 0.2rem rgba(234, 29, 44, 0.25);
        }

        .login-button {
          background-color: #ea1d2c;
          border: none;
          border-radius: 8px;
          padding: 0.75rem;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .login-button:hover {
          background-color: #c70909;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(234, 29, 44, 0.4);
        }

        .login-button:disabled {
          background-color: #ea1d2c;
          opacity: 0.7;
          transform: none;
        }

        .forgot-password-link {
          color: #ea1d2c;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }

        .forgot-password-link:hover {
          color: #c70909;
          text-decoration: underline;
        }

        .divider {
          position: relative;
          text-align: center;
        }

        .divider::before,
        .divider::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 45%;
          height: 1px;
          background: #dee2e6;
        }

        .divider::before {
          left: 0;
        }

        .divider::after {
          right: 0;
        }

        .divider span {
          background: white;
          padding: 0 1rem;
          color: #6c757d;
          font-size: 0.9rem;
        }

        .signup-text {
          color: #6c757d;
          font-size: 0.95rem;
          margin: 0;
        }

        .signup-link {
          color: #ea1d2c;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .signup-link:hover {
          color: #c70909;
          text-decoration: underline;
        }

        .alert {
          border-radius: 8px;
          border: none;
        }

        /* Responsividade */
        @media (max-width: 768px) {
          .left-panel {
            display: none !important;
          }

          .right-panel {
            padding: 1rem;
          }

          .login-card {
            max-width: 100%;
          }

          .title {
            font-size: 2rem;
          }

          .subtitle {
            font-size: 1rem;
          }
        }

        @media (max-width: 576px) {
          .login-title {
            font-size: 1.75rem;
          }

          .logo-text {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </Container>
  );
}

