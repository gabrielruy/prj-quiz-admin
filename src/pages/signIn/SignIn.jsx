import React, { Component } from "react";

import Logo from "../../assets/logo/IFSP_Logo.jpg";

import "../../assets/styles/signIn.css";

class SignIn extends Component {
  state = {
    email: "",
    password: "",
    error: ""
  };

  // redirect = () => (
  //   this.props.history.push("/home")
  // );

  render() {
    return (
      <div className="Container">
        <form className="Form" onSubmit={this.redirect}>
          {/* <img src={Logo} alt="IFSP logo" /> */}
          {this.state.error && <p>{this.state.error}</p>}
          <input
            type="email"
            placeholder="Endereço de e-mail"
            onChange={e => this.setState({ email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Senha"
            onChange={e => this.setState({ password: e.target.value })}
          />
          <button type="submit">Entrar</button>
        </form>
      </div>
    );
  }
}

export default SignIn;
