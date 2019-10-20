import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import api from '../../services/api';

import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
} from './styles';

class Main extends Component {
  static navigationOptions = {
    title: 'Usuarios',
  };

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    newUser: '',
    users: [],
    loading: false,
  };

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users');

    if (users) {
      this.setState({ users: JSON.parse(users) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { users } = this.state;

    if (prevState.users !== users) {
      AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  handleAddUser = async () => {
    const { users, newUser } = this.state;

    if (newUser === '' || !newUser) {
      return showMessage({
        message: 'Campo Vazio :(',
        type: 'info',
        icon: 'auto',
        position: 'bottom',
        backgroundColor: '#7159c1',
      });
    }

    this.setState({ loading: true });

    const { data } = await api.get(`/users/${newUser}`);

    const userData = {
      name: data.name,
      login: data.login,
      bio: data.bio,
      avatar: data.avatar_url,
    };

    this.setState({
      users: [...users, userData],
      newUser: '',
      loading: false,
    });

    Keyboard.dismiss();

    showMessage({
      message: ' Voce adicionou um Usuario Novo :)',
      type: 'success',
      icon: 'auto',
      position: 'bottom',
      backgroundColor: '#7159c1',
    });
  };

  handleNavigation = user => {
    const { navigation } = this.props;

    navigation.navigate('User', { user });
  };

  render() {
    const { users, newUser, loading } = this.state;

    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar usuario"
            value={newUser}
            onChangeText={text => this.setState({ newUser: text })}
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
          />
          <SubmitButton loading={loading} onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
                <Icon name="plus" size={24} color="#fff" />
              )}
          </SubmitButton>
        </Form>

        <List
          data={users}
          keyExtractor={user => user.login}
          renderItem={({ item }) => (
            <User>
              <Avatar source={{ uri: item.avatar }} />
              <Name>{item.name}</Name>
              <Bio>{item.bio}</Bio>

              <ProfileButton
                onPress={() => {
                  this.handleNavigation(item);
                }}
              >
                <ProfileButtonText>Ver Perfil</ProfileButtonText>
              </ProfileButton>
            </User>
          )}
        />
        <FlashMessage />
      </Container>
    );
  }
}

export default Main;
