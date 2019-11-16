import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Logo from '../../assets/logo/IFSP_Logo.jpg';

import '../../assets/styles/signIn.css';
import { login } from '../../services/auth';
import api from '../../services/api';

class SignIn extends Component {
  state = {
    email: '',
    password: '',
    error: '',
  };

  // redirect = () => (
  //   this.props.history.push("/home")
  // );

  handleEmailChange = (email) => {
    this.setState({ email });
  }

  handlePasswordChange = (password) => {
    this.setState({ password });
  }

  handleSignIn = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    if (!email || !password) {
      this.setState({ error: 'Preencha e-mail e senha para continuar!' });
    } else {
      try {
        const isAdmin = await api.get(`/users/is-admin?email=${email}`);
        if (!isAdmin.data) {
          throw Error('Não é um administrador');
        }
        const response = await api.post('/login', { email, password });
        login(response.data);
        this.props.history.push('/');
      } catch (err) {
        this.setState({
          error:
            'Houve um problema com o login, verifique suas credenciais.',
        });
      }
    }
  };

  render() {
    return (
      <div className="Container">
        <form className="Form" onSubmit={this.handleSignIn}>
          {/* <img src={Logo} alt="IFSP logo" /> */}
          {this.state.error && <p>{this.state.error}</p>}
          <input
            type="email"
            value={this.state.email}
            placeholder="Endereço de e-mail"
            onChange={e => this.handleEmailChange(e.target.value)}
          />
          <input
            type="password"
            value={this.state.password}
            placeholder="Senha"
            onChange={e => this.handlePasswordChange(e.target.value)}
          />
          <button type="submit">Entrar</button>
        </form>
      </div>
    );
  }
}

export default withRouter(SignIn);
