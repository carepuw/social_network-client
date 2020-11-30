import React from 'react'
import { Button, Form } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'

import FETCH_POSTS_QUERY from '../util/graphql'
import useForm from '../util/hooks'

function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: '',
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
      values.body = "";
    },
    onError(err) {
      return console.log(err);
    },
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <Form onSubmit={onSubmit}>
      <h2>Create a post:</h2>
      <Form.Field>
        <Form.Input
          placeholder="Hi World!"
          name="body"
          error={error ? true : false}
          onChange={onChange}
          value={values.body}
        />
        <Button type="submit" color="teal">
          Submit
        </Button>
      </Form.Field>
    </Form>
  )
}

const CREATE_POST_MUTATION = gql `
mutation createPost(
  $body: String!
) {
  createPost(
    body: $body
  ) {
    id body createdAt imageUrl username commentCount likeCount
    likes {
      id username createdAt
    }
    comments {
      id body username createdAt
    }
  }
}
`

export default PostForm;
