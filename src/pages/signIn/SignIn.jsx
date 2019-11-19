import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Spin } from 'antd';

// import Logo from '../../assets/logo/'

import '../../assets/styles/signIn.css';
import { login } from '../../services/auth';
import api from '../../services/api';

class SignIn extends Component {
  state = {
    email: '',
    password: '',
    error: '',
    loading: false,
  };

  handleEmailChange = (email) => {
    this.setState({ email });
  }

  handlePasswordChange = (password) => {
    this.setState({ password });
  }

  handleLoadingChange = (loading) => {
    this.setState({ loading });
  }

  handleSignIn = async (e) => {
    e.preventDefault();
    this.handleLoadingChange(true);
    const { email, password } = this.state;
    if (!email || !password) {
      this.handleLoadingChange(false);
      this.setState({ error: 'Preencha e-mail e senha para continuar!' });
    } else {
      try {
        const isAdmin = await api.get(`/users/is-admin?email=${email}`);
        if (!isAdmin.data) {
          throw Error('Não é um administrador');
        }
        const response = await api.post('/login', { email, password });
        login(response.data);
        this.handleLoadingChange(false);
        this.props.history.push('/');
      } catch (err) {
        this.handleLoadingChange(false);
        this.setState({
          error:
            'Houve um problema com o login, verifique suas credenciais.',
        });
      }
    }
  };

  render() {
    return (
      <div className="container-login">
        <form className="form-login" onSubmit={this.handleSignIn}>
          <img src={'https://d1lpyqedjaq3m8.cloudfront.net/aprova/arquivosconcursos/instituicoes/2019/04/1555013207.jpg'} alt="IFSP logo" />
          {this.state.error && <p className="p-login">{this.state.error}</p>}
          <input
            className="input-login"
            type="email"
            value={this.state.email}
            placeholder="Endereço de e-mail"
            onChange={e => this.handleEmailChange(e.target.value)}
          />
          <input
            className="input-login"
            type="password"
            value={this.state.password}
            placeholder="Senha"
            onChange={e => this.handlePasswordChange(e.target.value)}
          />
          <button className="button-login" type="submit" disabled={this.state.loading}>
            {this.state.loading ? <Spin /> : 'Entrar'}
          </button>
        </form>
      </div>
    );
  }
}

export default withRouter(SignIn);
