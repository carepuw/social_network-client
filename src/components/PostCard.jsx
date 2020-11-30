import React from 'react'
import { Card, Icon, Label, Image, Button } from 'semantic-ui-react'
import moment from 'moment'
import { Link } from 'react-router-dom'

import DeleteButton from './DeleteButton'
import LikeButton from './LikeButton'
import { AuthContext } from '../context/auth'

import '../App.css';

function PostCard({ post:{ body, createdAt, id, imageUrl, username, likeCount, commentCount, likes, comments } }) {
  const { user } = React.useContext(AuthContext);

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src={imageUrl}
        />
        <Card.Header className="post_username">
          {username}
          {user && user.username === username && <DeleteButton postId={id} />}
        </Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow()}</Card.Meta>
        <Card.Description className="post-body">
          {body}
        </Card.Description>
      </Card.Content>
      <Card.Content className="card_buttons" extra>
        <div className="but_container">
          <LikeButton user={user} post={{id, likes, likeCount}} />
        </div>
        <div>
          <Button className="comments_but" labelPosition='right' as={Link} to={`/posts/${id}`}>
            <Button color='blue' basic>
              <Icon name='comments' />
                Comments
            </Button>
            <Label basic color='blue' pointing='left'>
              {commentCount}
            </Label>
          </Button>
        </div>
      </Card.Content>
    </Card>
  )
}

export default PostCard;
