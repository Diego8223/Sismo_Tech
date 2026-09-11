import { FormEvent, useState } from "react";
import { Activity, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("usuario@sismotech.com");
  const [password, setPassword] = useState("123456");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!login(email, password)) return setError("Completa el correo y la contraseña.");
    navigate("/dashboard");
  };

  return <div className="login-page">
    <div className="login-brand-panel">
      <div className="login-logo"><Activity size={42} /><span>SISMO <b>TECH</b></span></div>
      <p>Sistema de Información para la Gestión de Afectaciones por Sismos</p>
      <div className="earthquake-art"><div className="wave">〰〰〰〰</div><div className="city">⌂  ⌂  ⌂  ⌂</div></div>
    </div>
    <div className="login-form-panel">
      <form className="login-form" onSubmit={submit}>
        <h1>Iniciar sesión</h1><p>Accede a tu cuenta para continuar</p>
        <label>Correo electrónico</label><div className="input-icon"><Mail size={17}/><input value={email} onChange={e=>setEmail(e.target.value)} type="email" /></div>
        <label>Contraseña</label><div className="input-icon"><Lock size={17}/><input value={password} onChange={e=>setPassword(e.target.value)} type={show ? "text" : "password"} /><button type="button" className="field-icon" onClick={()=>setShow(!show)}>{show ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div>
        <div className="login-options"><label className="remember"><input type="checkbox"/> Recordarme</label><a href="#">¿Olvidaste tu contraseña?</a></div>
        {error && <div className="form-error">{error}</div>}
        <button className="btn btn-primary login-button">Ingresar</button>
        <small className="login-footer">© 2026 Sismo Tech. Todos los derechos reservados.</small>
      </form>
    </div>
  </div>;
}
