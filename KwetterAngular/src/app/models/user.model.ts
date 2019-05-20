import {Following} from './following.model';

export interface User {
  'name': string;
  'email': string;
  'kweets': [{
    dateTime: string,
    content: string,
    user: string
  }];
  'details': {
    bio: string,
    website: string,
    location: {
      country: string,
      city: string,
      street: string,
      house_number: string
    }
  };
  'likes': [object];
  'followings': [Following];
}
