import React from 'react'
import { Icon, Confirm } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'


import FETCH_POSTS_QUERY from '../util/graphql'

function DeleteButton({postId, commentId, callback}) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
  
  const [deletePostOrMutation] = useMutation(mutation,{
    update(proxy){
      setConfirmOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY, 
          data: {
            getPosts: [...data.getPosts.filter(p => p.id !== postId)]
          }
        });
      }
      if(callback) {callback();};
    },
    variables: {
      postId, 
      commentId
    }
  })

  return (
    <React.Fragment>
      <div data-tooltip="Delete post">
      <Icon
        data-content="delete"
        name="trash" 
        onClick={() => setConfirmOpen(true)}
      />
      </div>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrMutation}
      />
    </React.Fragment>
  )
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!){
    deletePost(postId: $postId)
  }
`

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: String!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton
