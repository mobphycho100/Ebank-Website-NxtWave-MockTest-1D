import {Redirect} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    userId: '',
    pin: '',
    showErrorMsg: false,
    errorMsg: '',
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showErrorMsg: true, errorMsg, userId: '', pin: ''})
  }

  handleSubmit = async event => {
    event.preventDefault()

    const {userId, pin} = this.state
    const userDetails = {user_id: userId, pin}
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    const {userId, pin, showErrorMsg, errorMsg} = this.state

    return (
      <div className="bg-container">
        <div className="main-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            alt="website login"
            className="login-image"
          />
          <form onSubmit={this.handleSubmit} className="form-container">
            <h1 className="form-heading">Welcome Back!</h1>
            <label htmlFor="userId" className="label">
              User ID
            </label>
            <input
              id="userId"
              type="text"
              className="input"
              placeholder="Enter User ID"
              value={userId}
              onChange={event => this.setState({userId: event.target.value})}
            />
            <label htmlFor="pin" className="label">
              PIN
            </label>
            <input
              id="pin"
              type="password"
              className="input"
              placeholder="Enter PIN"
              value={pin}
              onChange={event => this.setState({pin: event.target.value})}
            />
            <button type="submit" className="submit-button">
              Login
            </button>
            {showErrorMsg && <p className="error-msg">{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
