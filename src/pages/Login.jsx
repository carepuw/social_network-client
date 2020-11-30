import gql from 'graphql-tag';
import { useMutation } from '@apollo/client'
import React from 'react'
import { Button, Form } from 'semantic-ui-react'

import { AuthContext } from '../context/auth'
import useForm from '../util/hooks'

function Login (props) {
  const context = React.useContext(AuthContext);
  const [errors, setErrors] = React.useState({});

  const {onChange, onSubmit, values} = useForm(loginUserCallback,{
    username: '',
    password: '',
  })

  const [loginUser, { loading }] = useMutation(LOGIN_USER,{
    update(_, { data: {login: userData} }) {
      context.login(userData);
      props.history.push('/');
    },
    onError(err){
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  })
  
  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className="registration_block">
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <div className="page_title">
          <h1>Login</h1>
        </div>
        <Form.Input
          label="Username"
          placeholder="Username..."
          name="username"
          type="text"
          error={errors.username ? true : false}
          value={values.username}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password..."
          name="password"
          type="password"
          error={errors.password ? true : false}
          value={values.password}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 &&
      <div className="ui error message">
        <ul className="list">
          {Object.values(errors).map( (value) => 
            <li key={value}>{value}</li>
          )}
        </ul>
      </div>}
    </div>
  )
}

const LOGIN_USER = gql`
  mutation login(
    $username: String!
    $password: String!
  ) {
    login (
        username: $username
        password: $password
    ) {
      id username createdAt token imageUrl
    }
  }
`

export default Login;