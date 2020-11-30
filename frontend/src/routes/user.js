import { useQuery, gql } from '@apollo/client';

const LOGIN = gql`
  query userLogin($email:String!,$password : String!) {
    login(email:$email,password : $password) {
      userId
      token
      tokenExpiration
    }
  }
`;

function login (email,password){
    const { loading, error, data } = useQuery(LOGIN, {
        variables: { email,password },
      });
      if (loading) return null;
      if (error) return `Error! ${error}`;
      //console.log('data',data)
}

export default login