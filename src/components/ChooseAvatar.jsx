import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'

function ChooseAvatar({choosenAvatar}) {
  const { data: { getAvatars: avatars } = {}} = useQuery(UPLOAD_AVATARS);
  const [selectedImage, setSelectedImage] = React.useState(0);

  const changeSelectedImage = (index) => {
    setSelectedImage(index);
    choosenAvatar(avatars[index].imageUrl);
  }

  return (
    <div style={{margin: '0'}} className="ui four cards">
      {avatars && avatars.map( (item, index) => 
        <a 
          key={item.id} 
          onClick={() => changeSelectedImage(index)}
          className={`blue card`}
        >
          <div className={`image ${selectedImage === index ? 'selectedImage' : ''}`}>
            <img alt="avatar" src={item.imageUrl}/>
          </div>
        </a>
      )}
    </div>
  )
}

const UPLOAD_AVATARS = gql `
  {
    getAvatars {
      imageUrl id
    }
  }
`

export default ChooseAvatar;
