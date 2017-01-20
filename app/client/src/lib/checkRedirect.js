
import history from '../history';

export default (props) => {
  if (props.loggedIn) {
    history.push('/');
  }
}
