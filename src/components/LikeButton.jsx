import React from 'react'
import { Icon, Label, Button } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client';

function LikeButton({ user, post: { id, likeCount, likes } }) {
  const [liked, setLiked] = React.useState(false);

  React.useEffect(() => {
    if (user && likes.find(like => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION,{
    variables: {postId: id}
  });

  const likeButton = user ? (
    liked ? (
      <Button color='teal' onClick={likePost}>
        <Icon name='heart' />
        Liked
      </Button>
    ) : (
      <Button color='teal' basic onClick={likePost}>
        <Icon name='heart' />
        Like
      </Button>
      )
  ) : (
    <Button color='teal' basic>
      <Icon name='heart' />
      Like
    </Button>
  )

  return (
    <Button as='div' labelPosition='right'>
      {likeButton}
      <Label basic color='teal' pointing='left'>
        {likeCount}
      </Label>
    </Button>
  )
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!){
    likePost(postId: $postId){
      id likeCount
      likes {
        id username
      }
    }
  }
`

export default LikeButton;
