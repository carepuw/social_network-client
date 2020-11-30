import React from 'react'
import gql from 'graphql-tag'
import { useMutation, useQuery } from '@apollo/client'
import { Grid, Image, Icon, Card, Button, Label, Form } from 'semantic-ui-react';
import moment from 'moment'

import { AuthContext } from '../context/auth'
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';


function SinglePost(props) {
  const postId = props.match.params.postId;
  const {user} = React.useContext(AuthContext);

  const [comment, setComment] = React.useState('');

  const { data: { getPost: posts } = {} } = useQuery(FETCH_POST_QUERY,{
    variables: {postId}
  })
  
  const [createComment] = useMutation(CREATE_COMMENT,{
    update(){
      setComment('');
    },
    variables: {
      postId,
      body: comment
    }
  })
  
  function deleteCallback(){
    props.history.push('/');
  }

  let postMarkup;
  if(!posts) {
    postMarkup = <p>Loading post...</p>
  } else {
    const { id, body, createdAt, imageUrl, username, comments, likes, likeCount, commentCount } = posts;
  
    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image 
              src={imageUrl}
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header className="post_username">
                  {username}
                  {user && user.username === username &&
                    <DeleteButton postId={id} callback={deleteCallback} />
                  }
                </Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description className="singlePage_postBody">{body}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <LikeButton user={user} post={{id, likeCount, likes}}/>
                <Button
                  as="div"
                  labelPosition="right"
                  onClick={()=> console.log('comment post')}
                >
                  <Button basic color="blue">
                    <Icon name="comments" />
                  </Button>
                  <Label basic color="blue" pointing="left">
                    {commentCount}
                  </Label>
                </Button>
              </Card.Content>
            </Card>
            { user && 
              <Card fluid>
                <Card.Content className="create_comment">
                  <Card.Header>
                    Post a comment
                  </Card.Header>
                </Card.Content>
                <Card.Content extra>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment.."
                        name="comment"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ''}
                        onClick={createComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            }
            {comments && comments.map( comment => 
              <Card fluid key={comment.id}>
                <Card.Content>
                  <div className="comment_header">
                    <div className="comment_image">
                      <Image src={comment.imageUrl} />
                    </div>
                    <div className="comment_info">
                      <Card.Header className="post_username">
                        {comment.username}
                        {user && user.username === comment.username &&
                          <DeleteButton postId={`${id}`} commentId={`${comment.id}`}/>
                        }
                      </Card.Header>
                      <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                    </div>
                  </div>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>  
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  return postMarkup;
}

const CREATE_COMMENT = gql`
  mutation($postId: String!, $body: String!){
    createComment(postId: $postId, body: $body){
      id commentCount
      comments {
        id body createdAt username
      }
    }
  }
`

const FETCH_POST_QUERY = gql `
  query($postId: ID!){
    getPost(postId: $postId){
      id body createdAt username likeCount commentCount imageUrl
      likes{
        username
      }
      comments {
        id username createdAt body imageUrl
      }
    }
  }
`

export default SinglePost;
